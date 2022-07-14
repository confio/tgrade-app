import { And, Given } from "cypress-cucumber-preprocessor/steps";

const validatorMnemonicNode1 =
  "merit daring radio hospital exchange kitten skirt cry seven evil faculty lion cup inherit live host stable tuna convince tip blur sphere curve search";

Given("I visit Validators page", () => {
  cy.visit("/validators");
  cy.wait(8000); //workaround until fetching validators
});

And("I click on Validator name {string} to open Validator detail modal", (validatorName) => {
  cy.findByText(validatorName).click();
});

And("I set validator mnemonic", () => {
  localStorage.setItem("burner-wallet", validatorMnemonicNode1);
});

And("I verify presence of validator name {string} and address {string}", (validatorName, address) => {
  cy.get(`[data-cy="validator-name-${validatorName}"]`)
    .should("contain.text", validatorName)
    .should("contain.text", address);
});

And("I see validator's name {string}, address {string}", (validatorName, address) => {
  cy.get('[data-cy="details-dialog-validator-name"]').should("contain.text", validatorName);
  cy.get('[data-cy="address-copy-tooltip-tag-hash"]').should("contain.text", address);
});

And("I see slashing events {string}, and voting power {string}", (slashingEvents, votingPower) => {
  cy.get('[data-cy="validator-detail-dialog-voting-power"]').should("have.text", votingPower);
  //TODO slashing data is not present
});
