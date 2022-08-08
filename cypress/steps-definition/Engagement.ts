import { Bip39, Random } from "@cosmjs/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And } from "cypress-cucumber-preprocessor/steps";

import { ConnectWalletModal } from "../page-object/ConnectWalletModal";
import { EngagementPage } from "../page-object/EngagementPage";

const engagementPage = new EngagementPage();
const connectWalletModal = new ConnectWalletModal();

And('I see the "Address" field prefilled with my {string}', (walletAddress) => {
  cy.get(engagementPage.getQueryAddressInputField()).should("have.value", walletAddress);
});

And('I enter the address of the other account on the "Receiver address" field', async () => {
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

And("I see Tx success screen with my address {string}", (address) => {
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", address);
});

And("I click Go to Engagement button", () => {
  cy.get(engagementPage.getTransactionResultScreenGoToEngagementButton()).click();
});

And("I check that my TGD balance has gone up {string}", (tokenBalance) => {
  cy.get(connectWalletModal.getTokenBalance()).should("contain.text", tokenBalance);
});

async function generateWalletAddress() {
  const mnemonic_01 = generateMnemonic();
  const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: "tgrade",
  });
  const { address: walletAddress } = (await wallet_01.getAccounts())[0];
  console.log(walletAddress);
  return walletAddress;
}

const generateMnemonic = (): string => Bip39.encode(Random.getBytes(16)).toString();
