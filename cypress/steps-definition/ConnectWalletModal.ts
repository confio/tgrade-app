import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { selectMnemonicByNumber, selectWalletAddressByNumber } from "../fixtures/existingAccounts";
import { selectRandomGeneratedMnemonicByNumber } from "../fixtures/randomGeneratedAccount";
import { ConnectWalletModal } from "../page-object/ConnectWalletModal";
import { ValidatorDetailsDialog } from "../page-object/ValidatorDetailsDialog";

const connectWalletModal = new ConnectWalletModal();
const validatorDetailsDialog = new ValidatorDetailsDialog();

Given("Set existing {string} wallet with Engagement Points and Engagement Rewards", async (walletNumber) => {
  const mnemonic = selectMnemonicByNumber(walletNumber);
  localStorage.setItem("burner-wallet", mnemonic);
  cy.reload(); //workaround help to apply new mnemonic and exchange address
  Cypress.on("uncaught:exception", (err) => !err.message.includes("Failed to fetch"));
});

Given("Set {string} wallet without Engagement Points and Engagement Rewards", async (walletNumber) => {
  const mnemonic = selectRandomGeneratedMnemonicByNumber(walletNumber);
  localStorage.setItem("burner-wallet", mnemonic);
  cy.reload(); //workaround help to apply new mnemonic and exchange address
  Cypress.on("uncaught:exception", (err) => !err.message.includes("Failed to fetch"));
});

And("I see my TGD balance in wallet {string}", async (walletNumber) => {
  const mnemonic = selectMnemonicByNumber(walletNumber);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const { address: walletUserA } = (await wallet.getAccounts())[0];
  const signingClient_01 = await createSigningClient(config, wallet);

  const walletBalanceUser = await signingClient_01.getBalance(walletUserA, config.feeToken);
  cy.get(connectWalletModal.getTokenBalance()).should("contain.text", walletBalanceUser.amount.slice(0, 3));
});

And("I close wallet dialog modal", () => {
  cy.get(connectWalletModal.getCloseIcon()).click();
  cy.get(connectWalletModal.getCloseIcon()).should("not.exist");
});

And(
  "I see that TGD balance {string} has gone up for {string} address",
  (expectedTokenBalance, accountAddress) => {
    const selectedAccountAddress = selectWalletAddressByNumber(accountAddress);
    cy.get(validatorDetailsDialog.getAddressTooltipTagHash()).should("contain.text", selectedAccountAddress);
    cy.wait(2000); // workaround to wait until full balance will be displayed
    cy.get(connectWalletModal.getTokenBalance()).then(($element) => {
      const extractedTokenValue = parseInt($element.text());
      expect(extractedTokenValue).to.be.not.lessThan(parseInt(expectedTokenBalance));
    });
  },
);

And("I see TGD balance for {string} address", (expectedTokenBalance) => {
  cy.wait(3000); // workaround to wait for balance to be visible
  cy.get(connectWalletModal.getTokenBalance()).then(($element) => {
    const extractedTokenValue = parseInt($element.text());
    expect(extractedTokenValue).to.be.not.lessThan(parseInt(expectedTokenBalance));
  });
});

And("I click on token with {string} symbol", (tokenSymbol) => {
  cy.get(connectWalletModal.getTokenNameFromTheList(tokenSymbol)).click();
});

And("I see {string} balance for {string} token", () => {
  cy.get(connectWalletModal.getDisplayedTokenBalance()).click();
  cy.get(connectWalletModal.getTokenName()).click();
});

And("I enter amount {string} to send", (amountToSend) => {
  cy.get(connectWalletModal.getAmountToSendField()).type(amountToSend);
});

And("I enter recipient address from {string}", async (recipientMnemonic) => {
  const randomSelectedMnemonicAddress = selectRandomGeneratedMnemonicByNumber(recipientMnemonic);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(randomSelectedMnemonicAddress, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const randomAddress = (await wallet.getAccounts())[0].address;
  cy.get(connectWalletModal.getRecipientAddressField()).type(randomAddress);
});

And("I click Send tokens button", () => {
  cy.get(connectWalletModal.getSendButton()).click();
});

And("I click Go to Wallet button", () => {
  cy.get(connectWalletModal.getGoToWalletButton()).click();
});
