import { And } from "cypress-cucumber-preprocessor/steps";

import { DistributedRewardsDialog } from "../page-object/DistributedRewardsDialog";

const distributedRewardsDialog = new DistributedRewardsDialog();

And(
  "I see Distributed Points {string} and Distributed Rewards {string} TGD",
  (expectedPoints, expectedRewards) => {
    cy.get(distributedRewardsDialog.getDistributedPointsValue()).should(($element) => {
      const extractedTokenValue = parseInt($element.text());
      expect(extractedTokenValue).to.be.not.lessThan(parseInt(expectedPoints));
    });

    cy.get(distributedRewardsDialog.getDistributedRewardsValue()).should(($element) => {
      const extractedTokenValue = parseInt($element.text());
      expect(extractedTokenValue).to.be.not.lessThan(parseInt(expectedRewards));
    });
  },
);

And("I click on Withdraw rewards button", () => {
  cy.get(distributedRewardsDialog.getWithdrawRewardsButton()).click();
});

And("I click on Go to Validator details button", () => {
  cy.get(distributedRewardsDialog.getGoToValidatorDetailsButton()).click();
  cy.wait(3000); //Workaround wait until transaction will be finished
});
