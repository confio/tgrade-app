import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { selectWalletAddressByNumber } from "../fixtures/existingAccounts";
import { selectRandomGeneratedMnemonicByNumber } from "../fixtures/randomGeneratedAccount";
import { TxSuccessScreen } from "../page-object/TxSuccessScreen";

const txSuccessScreen = new TxSuccessScreen();

And("I see Tx success screen with address from {string}", async (mnemonicNumber) => {
  const randomSelectedMnemonic = selectRandomGeneratedMnemonicByNumber(mnemonicNumber);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(randomSelectedMnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const address = (await wallet.getAccounts())[0].address;

  console.log("address" + address);
  cy.log("address" + address);

  await createSigningClient(config, wallet);
  cy.get(txSuccessScreen.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(txSuccessScreen.getTransactionResultScreenDetails()).should("contain.text", address);
});

And("I see Tx success screen with existing {string} address", (walletNumber) => {
  const walletAddress = selectWalletAddressByNumber(walletNumber);
  cy.get(txSuccessScreen.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(txSuccessScreen.getTransactionResultScreenDetails()).should("contain.text", walletAddress);
});

And("I see Tx success screen with {string} delegated address", (addressNumber) => {
  const walletAddress = selectWalletAddressByNumber(addressNumber);
  cy.get(txSuccessScreen.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(txSuccessScreen.getTransactionResultScreenDetails()).should("contain.text", walletAddress);
});

And("I see Tx success screen with initial {string} delegated address", (walletNumber) => {
  const address = selectWalletAddressByNumber(walletNumber);
  cy.get(txSuccessScreen.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(txSuccessScreen.getTransactionResultScreenDetails()).should("contain.text", address);
});

And("I see Tx success screen with created {string} token name", (createdTokenName) => {
  cy.get(txSuccessScreen.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(txSuccessScreen.getTransactionResultScreenDetails()).should("contain.text", createdTokenName);
});

And("I see Tx success screen with {string} amount of Deposit escrow", (escrowAmount) => {
  cy.get(txSuccessScreen.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(txSuccessScreen.getTransactionResultScreenDetails()).should("contain.text", escrowAmount);
});

And("I see Tx success screen", () => {
  cy.get(txSuccessScreen.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
});

And("I click on Go to Oversight Community details button", () => {
  cy.get(txSuccessScreen.getGoToOcDetailsButton()).click();
});

And("I click on Go to Oversight Community details button in Escrow modal", () => {
  cy.get(txSuccessScreen.getEscrowModalGoToOcDetailsButton()).click();
});
