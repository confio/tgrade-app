import { And } from "cypress-cucumber-preprocessor/steps";

import { selectWalletAddressByNumber } from "../fixtures/existingAccounts";
import { DistributedRewardsDialog } from "../page-object/DistributedRewardsDialog";

const distributedRewardsDialog = new DistributedRewardsDialog();

And(
  "I see Distributed Points {string} and Distributed Rewards {string} TGD",
  (expectedPoints, expectedRewards) => {
    cy.wait(3000); //Workaround wait until calculation will be finished
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

And('I see initial "Address" field is pre-filled with {string} in the dialog', (validatorAddress) => {
  const selectedValidatorAddress = selectWalletAddressByNumber(validatorAddress);
  cy.get(distributedRewardsDialog.getInitialValidatorAddressField()).should(
    "have.value",
    selectedValidatorAddress,
  );
});

And('I enter address {string} to "Receiver address" field', (addressName) => {
  const selectedAddress = selectWalletAddressByNumber(addressName);
  cy.get(distributedRewardsDialog.getReceiverAddressField()).type(selectedAddress);
});

And('I click on the "Withdraw rewards" button in the dialog', (addressName) => {
  cy.get(distributedRewardsDialog.getWithdrawRewardsButton()).click();
});
