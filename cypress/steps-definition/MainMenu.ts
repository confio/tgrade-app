import { Given } from "cypress-cucumber-preprocessor/steps";

Given("Open wallet dialog", () => {
  cy.get('[data-cy="main-menu-connect-wallet-icon"]').click();
});
