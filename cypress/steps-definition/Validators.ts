import { And, Given } from "cypress-cucumber-preprocessor/steps";

import {
  selectMnemonicByNumber,
  selectValidatorNameByAddressNumber,
  selectWalletAddressByNumber,
} from "../fixtures/existingAccounts";
import { StakeFormDialog } from "../page-object/StakeFormDialog";
import { ValidatorDetailsDialog } from "../page-object/ValidatorDetailsDialog";

const validatorDetailsDialog = new ValidatorDetailsDialog();
const stakeFormDialog = new StakeFormDialog();

Given("I navigate to Validators page by url", () => {
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

And("I see validator's address {string} with related account {string} name", (addressNumber) => {
  const selectedValidatorAddress = selectWalletAddressByNumber(addressNumber);
  const selectedValidatorName = selectValidatorNameByAddressNumber(addressNumber);
  cy.get(validatorDetailsDialog.getValidatorName()).should("contain.text", selectedValidatorName);
  cy.get(validatorDetailsDialog.getAddressTooltipTagHash()).should("contain.text", selectedValidatorAddress);
});

And("I see validator's name {string}, address {string}", (validatorName, address) => {
  cy.get(validatorDetailsDialog.getValidatorName()).should("contain.text", validatorName);
  cy.get(validatorDetailsDialog.getAddressTooltipTagHash()).should("contain.text", address);
});

And("I see slashing events {string}, and voting power {string}", (slashingEvents, votingPower) => {
  cy.get(validatorDetailsDialog.getVotingPowerValue()).should("have.text", votingPower);
  //TODO slashing data is not present
});

And('I click on the "Stake" button', () => {
  cy.get(validatorDetailsDialog.getStakeButton()).click();
});

And("I enter {string} liquid amount and {string} vesting amount", (liquidAmount, vestingAmount) => {
  cy.get(stakeFormDialog.getLiquidAmountField()).type(liquidAmount);
  cy.get(stakeFormDialog.getVestingAmountField()).type(vestingAmount);
});

And("I see how the input has changed my potential voting power {string}", (votingPower) => {
  cy.get(stakeFormDialog.getPotentialVotingPower()).should("have.value", votingPower);
});

And('I click on the "Stake tokens" button', () => {
  cy.get(stakeFormDialog.getStakeTokensButton()).click();
});

And("I see Tx success screen", () => {
  cy.get(stakeFormDialog.getTxSuccessScreen()).should("have.text", "Your transaction was approved!");
});
