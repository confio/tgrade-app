import { And } from "cypress-cucumber-preprocessor/steps";

import { EngagementPage } from "../page-object/EngagementPage";

const engagementPage = new EngagementPage();

And('I see the "Address" field prefilled with my {string}', (walletAddress) => {
  cy.get(engagementPage.getQueryAddressInputField()).should("have.value", walletAddress);
});

And(
  "I see my Engagement Points {string} and Engagement Rewards {string}",
  (engagementPoint, engagementRewards) => {
    cy.get('[data-cy="engagement-page-engagement-points"]').should("contain.text", engagementPoint);
    cy.get('[data-cy="engagement-page-engagement-rewards"]').should("contain.text", engagementRewards);
  },
);

And('I click on the "Withdraw rewards" button', () => {
  cy.get('[data-cy="engagement-page-withdraw-rewards-button"]').click();
});

And("I see Tx success screen with my address {string}", (address) => {
  cy.get('[data-cy="transaction-result-screen-text"]').should("have.text", "Your transaction was approved!");
  cy.get('[data-cy="transaction-result-screen-details"]').should("contain.text", address);
});

And("I click Go to Engagement button", () => {
  cy.get('[data-cy="transaction-result-screen-go-to-engagement-button"]').click();
});

And("I check that my TGD balance has gone up {string}", (tokenBalance) => {
  cy.get('[data-cy="connect-wallet-modal-token-token-balance"]').should("contain.text", tokenBalance);
});
