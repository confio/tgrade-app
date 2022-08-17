import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { selectMnemonicByNumber, selectWalletAddressByNumber } from "../fixtures/existingAccounts";
import { ValidatorDetailsDialog } from "../page-object/ValidatorDetailsDialog";

const validatorDetailsDialog = new ValidatorDetailsDialog();

Given("I visit Validators page", () => {
  cy.visit("/validators", { timeout: 8000 }); //workaround until fetching validators
});

And("Set validator with {string} mnemonic", (walletNumber) => {
  const mnemonic = selectMnemonicByNumber(walletNumber);
  localStorage.setItem("burner-wallet", mnemonic);
  cy.reload(); //workaround help to apply new mnemonic and exchange address
});

And("I click on Validator name {string} to open Validator detail modal", (validatorName) => {
  cy.findByText(validatorName).click();
});

And("I click {string} address on the list of validators", (validatorNumber) => {
  const mnemonic = selectWalletAddressByNumber(validatorNumber).slice(-6);
  cy.get('[data-cy="overview-page-validator-address"]').contains(mnemonic).click();
});

And("I verify presence of validator name {string} and address {string}", (validatorName, address) => {
  cy.get(`[data-cy="validator-name-${validatorName}"]`)
    .should("contain.text", validatorName)
    .should("contain.text", address);
});

And("I see validator's name {string}, address {string}", (validatorName, address) => {
  cy.get(validatorDetailsDialog.getValidatorName()).should("contain.text", validatorName);
  cy.get(validatorDetailsDialog.getAddressTooltipTagHash()).should("contain.text", address);
});

And("I see slashing events {string}, and voting power {string}", (slashingEvents, votingPower) => {
  cy.get(validatorDetailsDialog.getVotingPowerValue()).should("have.text", votingPower);
  //TODO slashing data is not present
});
