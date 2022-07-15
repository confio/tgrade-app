import { And } from "cypress-cucumber-preprocessor/steps";

import { ConnectWalletModal } from "../page-object/ConnectWalletModal";
import { EngagementPage } from "../page-object/EngagementPage";

const engagementPage = new EngagementPage();
const connectWalletModal = new ConnectWalletModal();

And('I see the "Address" field prefilled with my {string}', (walletAddress) => {
  cy.get(engagementPage.getQueryAddressInputField()).should("have.value", walletAddress);
});

And('I enter the address {string} of the other account on the "Receiver address" field', (address) => {
  cy.get(engagementPage.getReceiverAddressInputField()).type(address);
});

And(
  "I see my Engagement Points {string} and Engagement Rewards {string}",
  (engagementPoint, engagementRewards) => {
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

/*
async function createWalletAddress() {
  const mnemonic_01 = generateMnemonic();
  const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: "tgrade",
  });

  const { address: walletUserA } = (await wallet_01.getAccounts())[0];

  //const signingClient_01 = await createSigningClient(config, wallet_01);
  /!*  const { address: walletUserA } = (await wallet_01.getAccounts())[0];

  const faucetClient = new FaucetClient(config.faucetUrl);
  await faucetClient.credit(walletUserA, config.faucetTokens?.[0] ?? config.feeToken);

  // User_A wallet before send
  const walletBalanceUserABeforeSend = await signingClient_01.getBalance(walletUserA, config.feeToken);*!/

  return walletUserA;
}

const generateMnemonic = (): string => Bip39.encode(Random.getBytes(16)).toString();
*/
