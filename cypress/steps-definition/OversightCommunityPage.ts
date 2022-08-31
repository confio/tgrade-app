import { And } from "cypress-cucumber-preprocessor/steps";

import { OversightCommunityPage } from "../page-object/OversightCommunityPage";

const oversightCommunityPage = new OversightCommunityPage();

And("I click on the gear icon and on Leave Oversight Community", () => {
  cy.get(oversightCommunityPage.getGearLeaveIcon()).click();
  cy.get(oversightCommunityPage.getLeaveOversightCommunityOption()).click();
});

And("I click on Leave button in Leave OC modal", () => {
  cy.get(oversightCommunityPage.getOcModalLeaveButton()).click();
});

And("I see {string} because I am member of OC", (memberState) => {
  cy.contains(memberState).should("be.visible");
});

And("I see {string} because I am not a member anymore", (memberState) => {
  cy.reload(); //Workaround to see the changes (probably a bug)
  cy.contains(memberState).should("be.visible");
});

And("I see the address of the OC", () => {
  cy.get(oversightCommunityPage.getOversightCommunityAddress()).should("contain.text", "tgrade1");
});

And("I click on the address of the OC", () => {
  cy.get(oversightCommunityPage.getOversightCommunityAddress()).click();
  Cypress.on("uncaught:exception", (err) => !err.message.includes("The request is not allowed"));
  Cypress.on("uncaught:exception", (err) => !err.message.includes("The error you provided"));
  Cypress.on("uncaught:exception", (err) => !err.message.includes("Document is not focused"));
  // Both try catch is workaround for unknown error comes from cypress
  cy.contains("Address Copied").should("be.visible");
});

And("I check that my clipboard now contains the address of the OC", () => {
  // Workaround to grand permission to compare copied address
  cy.wrap(
    Cypress.automation("remote:debugger:protocol", {
      command: "Browser.grantPermissions",
      params: {
        permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
        // make the permission tighter by allowing the current origin only
        // on "http://localhost:3000"
        origin: window.location.origin,
      },
    }),
  );

  cy.get(oversightCommunityPage.getOversightCommunityAddress()).then(($element) => {
    const extractedAddress = $element.text();
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq(extractedAddress);
      });
    });
  });
});

And("I see the current voting rules for the Oversight Community", () => {
  cy.get(oversightCommunityPage.getVotingRulesQuorumValue()).should("contain.text", "51.00%");
  cy.get(oversightCommunityPage.getVotingRulesThresholdValue()).should("contain.text", "55.00%");
  cy.get(oversightCommunityPage.getVotingRulesVotingDurationValue()).should("contain.text", "30 days");
  cy.get(oversightCommunityPage.getVotingRulesVotingToEndEarlyValue()).should("contain.text", "Yes");
  cy.get(oversightCommunityPage.getVotingRulesMinimumEscrowValue()).should("contain.text", "1 TGD");
});

And("I see the half-life data for the Oversight Community", () => {
  cy.get(oversightCommunityPage.getEngagementHalfLifeDurationValue()).should("contain.text", "180 days");
});
