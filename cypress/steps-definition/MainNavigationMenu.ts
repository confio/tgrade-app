import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { selectRandomGeneratedMnemonicByNumber } from "../fixtures/randomGeneratedAccount";
import { EngagementPage } from "../page-object/EngagementPage";
import { MainNavigationMenu } from "../page-object/MainNavigationMenu";

const mainNavigationMenu = new MainNavigationMenu();
const engagementPage = new EngagementPage();

Given("Open wallet dialog from main menu", () => {
  cy.wait(3000); //Workaround wait until amount will be fetched
  cy.get(mainNavigationMenu.getConnectWalletIcon()).click();
});

Given("I connect Web Demo wallet", () => {
  cy.visit("/");
  Cypress.on("uncaught:exception", (err) => !err.message.includes("Failed to fetch"));
  cy.findByText("Connect wallet").click();
  cy.findByText("Web wallet (demo)").click();
  cy.findByText("Loading your Wallet").should("not.exist");
  cy.get(mainNavigationMenu.getConnectedWalletButton(), { timeout: 7000 }).should("exist");
  // workaround to wait for wallet connection (critical ~4000)
  // and to wait until account will be existed on chain
});

And("I visit Engagement page", () => {
  cy.get(mainNavigationMenu.getEngagementMenuOption()).click();
  cy.get(engagementPage.getLastHalfLifeEventDate()).should("be.visible"); //workaround until fetch is finished
});

And("I visit T-Market page", () => {
  cy.get(mainNavigationMenu.getTMarketMenuOption()).click();
});

And("I open Governance menu", () => {
  cy.get(mainNavigationMenu.getGovernanceMenuOption()).click();
});

And("I visit Validators page", () => {
  cy.get(mainNavigationMenu.getValidatorsSubMenuOption()).click();
});

And("I visit Oversight Community page", () => {
  cy.get(mainNavigationMenu.getOversightCommunitySubMenuOption()).click();
});

And("Send 10 tokens to {string} address", async (mnemonic) => {
  const selectedRandomMnemonic = selectRandomGeneratedMnemonicByNumber(mnemonic);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(selectedRandomMnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const signingClient_01 = await createSigningClient(config, wallet);
  const walletAddress = (await wallet.getAccounts())[0].address;

  console.log("wallet Address" + walletAddress);
  cy.log("wallet Address" + walletAddress);

  // Balance before send
  const walletBalanceUser = await signingClient_01.getBalance(walletAddress, config.feeToken);
  cy.log("Balance before send" + walletBalanceUser.amount);
  console.log("Balance after send" + walletBalanceUser.amount);

  const faucetClient = new FaucetClient(config.faucetUrl);
  // Send 10 tokens
  await faucetClient.credit(walletAddress, config.faucetTokens?.[0] ?? config.feeToken);

  // Balance after send
  const walletBalanceUserABeforeSend = await signingClient_01.getBalance(walletAddress, config.feeToken);
  console.log("Balance after send" + walletBalanceUserABeforeSend.amount);
  cy.log("Balance after send" + walletBalanceUserABeforeSend.amount);
});
