import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { selectMnemonicByNumber, selectWalletAddressByNumber } from "../fixtures/existingAccounts";
import { selectRandomGeneratedMnemonicByNumber } from "../fixtures/randomGeneratedAccount";
import { ConnectWalletModal } from "../page-object/ConnectWalletModal";
import { MainNavigationMenu } from "../page-object/MainNavigationMenu";
import { ValidatorDetailsDialog } from "../page-object/ValidatorDetailsDialog";

const connectWalletModal = new ConnectWalletModal();
const validatorDetailsDialog = new ValidatorDetailsDialog();
const mainNavigationMenu = new MainNavigationMenu();

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
    workaroundToWaitForPinnedTokenToBePresent();
    cy.get(connectWalletModal.getTokenBalance()).then(($element) => {
      const extractedTokenValue = parseInt($element.text());
      expect(extractedTokenValue).to.be.not.lessThan(parseInt(expectedTokenBalance));
    });
  },
);

function workaroundToWaitForPinnedTokenToBePresent() {
  cy.wait(2000);
  cy.get(connectWalletModal.getLoaderSpinnerIcon()).should("not.exist");
  cy.get(connectWalletModal.getConnectWalletModal()).then(($el) => {
    if ($el.find(connectWalletModal.getNoBalanceFoundForPinnedTokensText()).length > 0) {
      cy.get(connectWalletModal.getCloseIcon()).click();
      cy.wait(3000); // Waiting for token list to be appeared
      cy.get(mainNavigationMenu.getConnectedWalletButtonWithWalletAddress()).click();
      cy.get(connectWalletModal.getLoaderSpinnerIcon()).should("not.exist");
    }
  });
}

And("I click on token with {string} symbol", (tokenSymbol) => {
  cy.get(connectWalletModal.getTokenNameFromTheList(tokenSymbol)).click();
});

And("I see {string} balance for {string} token", (tokenBalance, tokenSymbol) => {
  workaroundToWaitForPinnedTokenToBePresent();
  cy.get(connectWalletModal.getTokenNameFromTheList(tokenSymbol))
    .find(connectWalletModal.getTokenBalance())
    .then(($element) => {
      const extractedTokenValue = parseInt($element.text());
      expect(extractedTokenValue).to.be.not.lessThan(parseInt(tokenBalance));
    });
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
