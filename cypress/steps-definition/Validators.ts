import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import {
  selectMnemonicByNumber,
  selectValidatorNameByAddressNumber,
  selectWalletAddressByNumber,
} from "../fixtures/existingAccounts";
import { selectRandomGeneratedMnemonicByNumber } from "../fixtures/randomGeneratedAccount";
import { DistributedRewardsDialog } from "../page-object/DistributedRewardsDialog";
import { StakeFormDialog } from "../page-object/StakeFormDialog";
import { UnStakeFormDialog } from "../page-object/UnStakeFormDialog";
import { ValidatorDetailsDialog } from "../page-object/ValidatorDetailsDialog";
import { ValidatorsMainPage } from "../page-object/ValidatorsMainPage";
import { ValidatorsOverviewPage } from "../page-object/ValidatorsOverviewPage";

const validatorDetailsDialog = new ValidatorDetailsDialog();
const stakeFormDialog = new StakeFormDialog();
const unStakeFormDialog = new UnStakeFormDialog();
const validatorsOverviewPage = new ValidatorsOverviewPage();
const validatorsMainPage = new ValidatorsMainPage();
const distributedRewardsDialog = new DistributedRewardsDialog();

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

And("I click on {string} address on the list of validators", (validatorNumber) => {
  const mnemonic = selectWalletAddressByNumber(validatorNumber).slice(-6);
  cy.get(validatorsMainPage.getAllNamesFromValidatorNameColumn()).contains(mnemonic).click();
});

And("I verify presence of validator name {string} and address {string}", (validatorName, address) => {
  cy.get(validatorsMainPage.getValidatorName(validatorName))
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

And('I click on the "Unstake" button', () => {
  cy.get(validatorDetailsDialog.getUnStakeButton()).click();
});

And("I enter {string} liquid amount and {string} vesting amount", (liquidAmount, vestingAmount) => {
  cy.get(stakeFormDialog.getLiquidAmountField()).type(liquidAmount);
  cy.get(stakeFormDialog.getVestingAmountField()).type(vestingAmount);
});

And("I see potential voting power has been changed to {string}", (votingPower) => {
  cy.wait(2000); //workaround wait until VP will be calculated
  cy.get(stakeFormDialog.getPotentialVotingPowerFromInputField()).should(($input) => {
    const extractedVotingPower = $input.val();
    if (typeof extractedVotingPower === "string") {
      const extractedValue = parseInt(extractedVotingPower);
      expect(extractedValue).to.be.not.lessThan(parseInt(votingPower));
    }
  });

  cy.get(stakeFormDialog.getPotentialVotingPowerFromText()).then(($element) => {
    const extractedVotingPower = parseInt($element.text());
    expect(extractedVotingPower).to.be.not.lessThan(parseInt(votingPower));
  });
});

And('I click on the "Stake tokens" button', () => {
  cy.get(stakeFormDialog.getStakeTokensButton()).click();
});

And("I click Go to Validator details page", () => {
  cy.get(stakeFormDialog.getGoBackToValidatorDetailsButton()).click();
  cy.wait(3000); //Wait for fetch to be finished and prevent opening validator details page
});

And("I see voting power {string} on Validator details dialog", (votingPower) => {
  cy.get(validatorDetailsDialog.getVotingPowerValue()).should(($input) => {
    const extractedVotingPower = parseInt($input.text());
    expect(extractedVotingPower).to.be.not.lessThan(parseInt(votingPower));
  });
});

And("I close validator details dialog", () => {
  cy.get(validatorDetailsDialog.getCloseDialogButton()).click();
  cy.wait(3000); //workaround to prevent appearing dialog after closing (probably a bug)
  cy.get("body").then(($el) => {
    if ($el.find(validatorDetailsDialog.getCloseDialogButton()).length > 0) {
      cy.get(validatorDetailsDialog.getCloseDialogButton()).click();
    } else {
      cy.log("Dialog does not appear second time!");
    }
  });
});

And(
  "I see voting power {string} for {string} validator in Validator overview table",
  (votingPower, validatorAddress) => {
    const validatorName = selectValidatorNameByAddressNumber(validatorAddress);
    cy.get(validatorsOverviewPage.getValidatorVotingPower(validatorName)).should(($input) => {
      const extractedVotingPower = parseInt($input.text());
      expect(extractedVotingPower).to.be.not.lessThan(parseInt(votingPower));
    });
  },
);

And("I enter {string} amount of TGD to be unstaked", (amount) => {
  cy.get(unStakeFormDialog.getAmountToUnStakeInputField()).type(amount);
});

And('I click on the "Unstake tokens" button', () => {
  cy.get(unStakeFormDialog.getUnStakeTokensButton()).click();
});

And('I click on the "Claim rewards" button', () => {
  cy.get(validatorDetailsDialog.getClaimRewardsButton()).click();
});

And("I click on withdraw rewards button", () => {
  cy.get(distributedRewardsDialog.getWithdrawRewardsButton()).click();
});

And(
  "I see Distributed points {string} value and Distributed rewards {string} in validators details dialog",
  (distributedPoints, distributedRewards) => {
    cy.get(validatorDetailsDialog.getDistributedRewardsValue()).should(($element) => {
      const extractedDistributedRewards = parseInt($element.text());
      expect(extractedDistributedRewards).to.be.not.lessThan(parseInt(distributedRewards));
    });
    cy.get(validatorDetailsDialog.getDistributedPointValue()).should(($element) => {
      const extractedDistributedPoints = parseInt($element.text());
      expect(extractedDistributedPoints).to.be.not.lessThan(parseInt(distributedPoints));
    });
  },
);

/*And("I see Delegate field is pre-field with address from {string}", async (addressNumber) => {
  const walletAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(addressNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", walletAddress);
});*/
