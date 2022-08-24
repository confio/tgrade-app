import { And } from "cypress-cucumber-preprocessor/steps";

import { DistributedRewardsDialog } from "../page-object/DistributedRewardsDialog";

const distributedRewardsDialog = new DistributedRewardsDialog();

And("I see Distributed Points {string} and Distributed Rewards {string} TGD", (engagementPoints, rewards) => {
  cy.get(distributedRewardsDialog.getDistributedPointsValue()).should("have.text", engagementPoints);
  cy.get(distributedRewardsDialog.getDistributedRewardsValue()).should("contain.text", rewards);
});

And("I click on Withdraw rewards button", () => {
  cy.get(distributedRewardsDialog.getWithdrawRewardsButton()).click();
});

And("I click on Go to Validator details button", () => {
  cy.get(distributedRewardsDialog.getGoToValidatorDetailsButton()).click();
});
