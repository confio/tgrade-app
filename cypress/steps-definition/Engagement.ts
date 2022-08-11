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
const thirdWalletAddress = "tgrade10jdqrtm46xsxtdmuyt2zfcrhupvycrpv80r7nh";

const selectWalletAddressByNumber = (walletNumber: string): string => {
  switch (walletNumber) {
    case "first":
      return firstWalletAddress;
    case "second":
      return secondWalletAddress;
    case "third":
      return thirdWalletAddress;
    default:
      return "no wallet number was provided";
  }
};

const generateMnemonic = (): string => Bip39.encode(Random.getBytes(16)).toString();
const mnemonic_01 = generateMnemonic();
const randomlyGeneratedAddress = makeRandomTgradeAddress();

And('I see the "Address" field prefilled with my {string} wallet', (walletNumber) => {
  const address = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getQueryAddressInputField()).should("have.value", address);
});

And('I enter the address of the other account in the "Receiver address" field', async () => {
  const randomlyGeneratedAddress = await generateWalletAddress();
  cy.log(randomlyGeneratedAddress);
  cy.get(engagementPage.getReceiverAddressInputField()).type(randomlyGeneratedAddress);
});

And('I see no any address in the "Receiver address" field', async () => {
  cy.get(engagementPage.getReceiverAddressInputField()).should("have.value", "");
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
  const walletAddress = selectWalletAddressByNumber(walletNumber);
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
  cy.get(engagementPage.getSetDelegateButton()).click();
});

And("I see Tx success screen with new delegated address", () => {
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", randomlyGeneratedAddress);
});

And("I see Tx success screen with {string} delegated address", (walletNumber) => {
  const address = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", address);
});

And("I see there is randomly generated address set in Delegate withdrawal field", () => {
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", randomlyGeneratedAddress);
});

And("I see Delegate withdrawal to field is pre-field with {string} address", (address) => {
  const preFieldAddress = selectWalletAddressByNumber(address);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", preFieldAddress);
});

And("I set new to the delegate account", () => {
  cy.get(engagementPage.getQueryAddressInputField()).clear().type(randomlyGeneratedAddress);
});

And("I check presence of main address with tokens in Address field", () => {
  cy.get(engagementPage.getQueryAddressInputField()).clear().type(randomlyGeneratedAddress);
});

And("I click on the Clear delegate button", () => {
  cy.get(engagementPage.getClearDelegateButton()).click();
});

And("I see I can no longer withdraw rewards for the initial account", () => {
  cy.get(engagementPage.getDisabledWithdrawRewardsButton()).should("be.disabled");
});

async function generateWalletAddress() {
  const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: "tgrade",
  });
  console.log(mnemonic_01);
  const { address: walletAddress } = (await wallet_01.getAccounts())[0];
  return walletAddress;
}

function makeRandomTgradeAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
