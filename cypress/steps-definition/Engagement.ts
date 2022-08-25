import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { selectMnemonicByNumber, selectWalletAddressByNumber } from "../fixtures/existingAccounts";
import {
  selectRandomGeneratedAddressByNumber,
  selectRandomGeneratedMnemonicByNumber,
} from "../fixtures/randomGeneratedAccount";
import { EngagementPage } from "../page-object/EngagementPage";

const engagementPage = new EngagementPage();

And('I see the "Address" field prefilled with my {string} wallet', (walletNumber) => {
  const address = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getInitialAddressInputField()).should("have.value", address);
});

And('I enter address in the "Receiver address" field from {string} wallet', async (mnemonicNumber) => {
  const randomAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(mnemonicNumber);
  cy.get(engagementPage.getReceiverAddressInputField()).type(randomAddress);
});

And('I enter existing {string} address in the "Receiver address" field', (orderNumber) => {
  const existingAddress = selectWalletAddressByNumber(orderNumber);
  cy.get(engagementPage.getReceiverAddressInputField()).type(existingAddress);
});

And('I see no any address in the "Receiver address" field', () => {
  cy.get(engagementPage.getReceiverAddressInputField()).should("have.value", "");
});

And(
  "I see Engagement Points {string} and Engagement Rewards {string} TGD",
  (engagementPoint, expectedEngagementRewards) => {
    cy.wait(3000); //Workaround wait until calculation will be finished
    cy.get(engagementPage.getEngagementPointsValue()).should("contain.text", engagementPoint);
    cy.get(engagementPage.getEngagementRewardsValue()).then(($element) => {
      const extractedRewardsValue = parseInt($element.text());
      console.log("extracted rewards value" + extractedRewardsValue);
      console.log("expected Engagement Rewards" + expectedEngagementRewards);
      expect(extractedRewardsValue).to.be.not.lessThan(parseInt(expectedEngagementRewards));
    });
  },
);

And('I click on the "Withdraw rewards" button', () => {
  cy.get(engagementPage.getWithdrawRewardsButton()).click();
});

And("I see Tx success screen with address from {string}", async (walletNumber) => {
  const addressMnemonic = selectRandomGeneratedMnemonicByNumber(walletNumber);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(addressMnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const address = (await wallet.getAccounts())[0].address;
  await createSigningClient(config, wallet);
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", address);
});

And("I see Tx success screen with existing {string} address", (walletNumber) => {
  const walletAddress = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", walletAddress);
});

And("I click Go to Engagement button", () => {
  cy.get(engagementPage.getTransactionResultScreenGoToEngagementButton()).click();
  Cypress.on("uncaught:exception", (err) => !err.message.includes("Failed to fetch"));
  // workaround probably bug in App
  cy.wait(3000); //Workaround to wait transaction to finished
});

And("I type {string} address in Delegated withdrawal to field", (walletNumber) => {
  const accountAddress = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).clear().type(accountAddress);
});

And("I type address from {string} in Delegated withdrawal to field", async (walletNumber) => {
  const accountAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(walletNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).clear().type(accountAddress);
});

And(
  "I use {string} to make query and check balance of this address {string}",
  async (receiveMnemonicAddress, tokenBalance) => {
    cy.wait(9000); // Experimenting to find until transaction will be finished
    const addressMnemonic = selectRandomGeneratedMnemonicByNumber(receiveMnemonicAddress);
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(addressMnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const { address: walletUserA } = (await wallet.getAccounts())[0];
    const signingClient_01 = await createSigningClient(config, wallet);

    const walletBalanceUser = await signingClient_01.getBalance(walletUserA, config.feeToken);
    console.log("walletBalanceUser.amount", walletBalanceUser.amount);
    console.log("tokenBalance", tokenBalance);
    expect(parseInt(walletBalanceUser.amount.slice(0, 3))).to.be.not.lessThan(parseInt(tokenBalance));
  },
);

And(
  "I use existing {string} mnemonic to make query and check balance {string}",
  async (receiveAddressMnemonic, tokenBalance) => {
    const addressMnemonic = selectMnemonicByNumber(receiveAddressMnemonic);
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(addressMnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const { address: walletUserA } = (await wallet.getAccounts())[0];
    const signingClient_01 = await createSigningClient(config, wallet);

    const walletBalanceUser = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(walletBalanceUser.amount.slice(0, 3)).to.contains(tokenBalance);
  },
);

And('I click the "Set delegate" button', () => {
  cy.get(engagementPage.getSetDelegateButton()).click();
});

And("I see Tx success screen with {string} delegated address", (addressNumber) => {
  const walletAddress = selectWalletAddressByNumber(addressNumber);
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", walletAddress);
});

And("I see Tx success screen with initial {string} delegated address", (walletNumber) => {
  const address = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", address);
});

And("I see there is random {string} address set in Delegate withdrawal field", (addressNumber) => {
  const randomAddress = selectRandomGeneratedAddressByNumber(addressNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", randomAddress);
});

And("I see there is existing {string} address set in Delegate withdrawal field", (addressNumber) => {
  const randomAddress = selectWalletAddressByNumber(addressNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", randomAddress);
});

And("I see Delegate field is pre-field with address {string}", (address) => {
  const preFieldAddress = selectWalletAddressByNumber(address);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", preFieldAddress);
});

And("I see Delegate field is pre-field with address from {string}", async (addressNumber) => {
  const walletAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(addressNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", walletAddress);
});

And("I see Delegate withdrawal to field is pre-field with {string} address", (addressNumber) => {
  const walletAddress = selectWalletAddressByNumber(addressNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", walletAddress);
});

And("I enter existing {string} address to initial Address field", (addressNumber) => {
  const randomAddress = selectWalletAddressByNumber(addressNumber);
  cy.get(engagementPage.getInitialAddressInputField()).clear().type(randomAddress);
});

And("I enter {string} address to initial Address field", (addressNumber) => {
  const randomAddress = selectRandomGeneratedAddressByNumber(addressNumber);
  cy.get(engagementPage.getInitialAddressInputField()).clear().type(randomAddress);
});

And("I click on the Clear delegate button", () => {
  cy.get(engagementPage.getClearDelegateButton()).click();
});

And("I see I can no longer withdraw rewards for the initial account", () => {
  cy.get(engagementPage.getDisabledWithdrawRewardsButton()).should("be.disabled");
});

And("Workaround to clear localstorage", () => {
  cy.clearLocalStorage("pinned-tokens-map");
  cy.clearLocalStorage("burner-wallet");
  cy.clearLocalStorage("last-wallet");
});

async function returnAddressOfRandomGeneratedMnemonicByNumber(mnemonicNumber: string) {
  const generatedMnemonic = selectRandomGeneratedMnemonicByNumber(mnemonicNumber);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(generatedMnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });
  const walletAddress = (await wallet.getAccounts())[0].address;
  const signingClient = await createSigningClient(config, wallet);

  const walletBalanceUser = await signingClient.getBalance(walletAddress, config.feeToken);
  expect(walletBalanceUser.amount).to.contains(0);
  return walletAddress;
}
