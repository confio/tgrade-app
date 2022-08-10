import { Bip39, Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { ConnectWalletModal } from "../page-object/ConnectWalletModal";
import { EngagementPage } from "../page-object/EngagementPage";

const engagementPage = new EngagementPage();
const connectWalletModal = new ConnectWalletModal();
const firstWalletAddress = "tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3";
const secondWalletAddress = "tgrade1aw7g4pxlzmj85fwhd3zs5hhgs0a9xeqg28z8jl";

const generateMnemonic = (): string => Bip39.encode(Random.getBytes(16)).toString();
const mnemonic_01 = generateMnemonic();
const randomlyGeneratedAddress = makeRandomTgradeAddress();

And('I see the "Address" field prefilled with my {string} wallet', (walletNumber) => {
  const walletAddress = walletNumber === "first" ? firstWalletAddress : secondWalletAddress;
  cy.get(engagementPage.getQueryAddressInputField()).should("have.value", walletAddress);
});

And('I enter the address of the other account in the "Receiver address" field', async () => {
  const randomlyGeneratedAddress = await generateWalletAddress();
  cy.log(randomlyGeneratedAddress);
  cy.get(engagementPage.getReceiverAddressInputField()).type(randomlyGeneratedAddress);
});

And(
  "I see my Engagement Points {string} and Engagement Rewards {string} TGD",
  (engagementPoint, engagementRewards) => {
    // TODO instead of hardcoded value, make a query to get current
    cy.get(engagementPage.getEngagementPointsValue()).should("contain.text", engagementPoint);
    cy.get(engagementPage.getEngagementRewardsValue()).should("contain.text", engagementRewards);
  },
);

And('I click on the "Withdraw rewards" button', () => {
  cy.get(engagementPage.getWithdrawRewardsButton()).click();
});

And("I see Tx success screen with my address {string}", (walletNumber) => {
  const walletAddress = walletNumber === "first" ? firstWalletAddress : secondWalletAddress;
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", walletAddress);
});

And("I click Go to Engagement button", () => {
  cy.get(engagementPage.getTransactionResultScreenGoToEngagementButton()).click();
});

And("I check that my TGD balance has gone up {string}", (tokenBalance) => {
  cy.get(connectWalletModal.getTokenBalance()).should("contain.text", tokenBalance);
});

And("I enter the address of a known account in Delegated withdrawal to field", () => {
  cy.get(engagementPage.getDelegatedWithdrawalToField()).clear().type(randomlyGeneratedAddress);
});

And("I check balance on new receive address {string}", async (tokenBalance) => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const { address: walletUserA } = (await wallet.getAccounts())[0];
  const signingClient_01 = await createSigningClient(config, wallet);

  const walletBalanceUser = await signingClient_01.getBalance(walletUserA, config.feeToken);
  expect(walletBalanceUser.amount.slice(0, 3)).to.contains(tokenBalance);
});

And('I click the "Set delegate" button', () => {
  cy.get(engagementPage.getSetDelegatedButton()).click();
});

And("I see Tx success screen with new delegated address", () => {
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", randomlyGeneratedAddress);
});

And("I see delegate address is still percent in the field", () => {
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", randomlyGeneratedAddress);
});

And("I set new to the delegate account", () => {
  cy.get(engagementPage.getQueryAddressInputField()).clear().type(randomlyGeneratedAddress);
});

async function generateWalletAddress() {
  const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: "tgrade",
  });
  const { address: walletAddress } = (await wallet_01.getAccounts())[0];
  return walletAddress;
}

function makeRandomTgradeAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
