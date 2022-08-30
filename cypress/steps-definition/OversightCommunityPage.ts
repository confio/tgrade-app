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
