import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { MainNavigationMenu } from "../page-object/MainNavigationMenu";

const manMenu = new MainNavigationMenu();

Given("Open wallet dialog", () => {
  cy.get('[data-cy="main-menu-connect-wallet-icon"]').click();
});

Given("I connect Web Demo wallet", () => {
  cy.visit("/");
  cy.findByText("Connect wallet").click();
  cy.findByText("Web wallet (demo)").click();
  cy.findByText("Loading your Wallet").should("not.exist");
  cy.get(manMenu.getConnectedWalletButton(), { timeout: 7000 }).should("exist");
  // workaround to wait for wallet connection (critical ~4000)
  // and to wait until account will be existed on chain
});

And("I visit Engagement page", () => {
  cy.get('[data-cy="main-nav-side-bar-engagement"]').click();
});
