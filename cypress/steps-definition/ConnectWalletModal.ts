import { And, Given } from "cypress-cucumber-preprocessor/steps";

// TODO move away this mnemonic to some other file storage
const walletWithEngagementPoints =
  "bone idea foster kid item private figure victory power reflect wrong bunker";

Given("Set wallet with Engagement Points and Engagement Rewards", () => {
  localStorage.setItem("burner-wallet", walletWithEngagementPoints);
  cy.reload(); //help to apply new mnemonic and exchange address
});

And("I see my TGD balance {string}", (tokenBalance) => {
  cy.get('[data-cy="connect-wallet-modal-token-token-balance"]').should("have.text", tokenBalance);
});

And("I close wallet dialog modal", () => {
  cy.get('[data-cy="connect-wallet-modal-close-icon"]').click();
});
