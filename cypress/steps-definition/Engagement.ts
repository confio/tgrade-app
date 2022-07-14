import { And } from "cypress-cucumber-preprocessor/steps";

And('I see the "Address" field prefilled with my {string}', (walletAddress) => {
  cy.get('[name="form-item-name-address"]').should("have.value", walletAddress);
});

And(
  "I see my Engagement Points {string} and Engagement Rewards {string}",
  (engagementPoint, engagementRewards) => {
    cy.get('[data-cy="engagement-page-engagement-points"]').should("contain.text", engagementPoint);
    cy.get('[data-cy="engagement-page-engagement-rewards"]').should("contain.text", engagementRewards);
  },
);
