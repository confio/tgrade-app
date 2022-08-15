import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { EngagementPage } from "../page-object/EngagementPage";
import { MainNavigationMenu } from "../page-object/MainNavigationMenu";

const mainNavigationMenu = new MainNavigationMenu();
const engagementPage = new EngagementPage();

Given("Open wallet dialog from main menu", () => {
  cy.get(mainNavigationMenu.getConnectWalletIcon()).click();
});

Given("I connect Web Demo wallet", () => {
  cy.visit("/");
  cy.findByText("Connect wallet").click();
  cy.findByText("Web wallet (demo)").click();

  cy.wait(14000); //Workaround for an error ipv6.icanhazip.com

  // Workaround for an issue in browser
  Cypress.on("uncaught:exception", (err) => !err.message.includes("Failed to fetch"));

  cy.findByText("Loading your Wallet").should("not.exist");
  cy.get(mainNavigationMenu.getConnectedWalletButton(), { timeout: 7000 }).should("exist");
  // workaround to wait for wallet connection (critical ~4000)
  // and to wait until account will be existed on chain
});

And("I visit Engagement page", () => {
  cy.get(mainNavigationMenu.getEngagementMenuOption()).click();
  cy.get(engagementPage.getLastHalfLifeEventDate()).should("be.visible"); //workaround until fetch is finished
});
