import { Given } from "cypress-cucumber-preprocessor/steps";

import { MainMenu } from "../page-object/MainMenu";

const manMenu = new MainMenu();

Given("I connect Web Demo wallet", () => {
  cy.visit("/");
  cy.findByText("Connect wallet").click();
  cy.findByText("Web wallet (demo)").click();
  cy.findByText("Loading your Wallet").should("not.exist");
  cy.get(manMenu.getConnectedWalletButton(), { timeout: 7000 }).should("exist");
  // workaround to wait for wallet connection (critical ~4000)
  // and to wait until account will be existed on chain
});
