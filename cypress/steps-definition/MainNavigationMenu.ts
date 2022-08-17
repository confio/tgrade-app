import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { EngagementPage } from "../page-object/EngagementPage";
import { MainNavigationMenu } from "../page-object/MainNavigationMenu";

const mainNavigationMenu = new MainNavigationMenu();
const engagementPage = new EngagementPage();

Given("Open wallet dialog from main menu", () => {
  cy.wait(1000); //Workaround wait until amount will be fetched
  cy.get(mainNavigationMenu.getConnectWalletIcon()).click();
});

Given("I connect Web Demo wallet", () => {
  cy.visit("/");
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
