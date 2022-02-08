import { And, Given, Then, When } from "cypress-cucumber-preprocessor/steps";

Given("I visit Trusted Circle page", () => {
  cy.visit("/trustedcircle");
});

When("I click on Add Trusted Circle button", () => {
  cy.findByText(/Add Trusted Circle/i).click();
});

Then("I click on Create Trusted Circle button", () => {
  cy.findByText(/Create Trusted Circle/i).click();
});

And("I enter Trusted Circle name as {string}", (text) => {
  cy.findByPlaceholderText(/Enter Trusted Circle name/i).type(text);
});

And("I click on Next button step#1 of Start Trusted Circle modal popup", () => {
  cy.findByRole("button", { name: /Next/i }).click();
});

And("I click on Next button step#2 of Start Trusted Circle modal popup", () => {
  cy.findByRole("button", { name: /Next/i }).click();
});

And("I click Connect wallet button on step#3", () => {
  cy.findByRole("button", { name: /Connect wallet/i }).click();
  cy.wait(1500); //should be improved
});
And("I select Web wallet demo", () => {
  cy.contains("Web wallet (demo)").click();
  cy.wait(1500); //should be improved
});
And("I click on Sign transaction and pay escrow button", () => {
  cy.findByRole("button", { name: /Sign transaction and pay escrow/i })
    .click()
    .should("not.exist");
});
And("I click on Go to Trusted Circle details button", () => {
  cy.findByRole("button", { name: /Go to Trusted Circle details/i }).click();
});
And("I see that {string} is created", (text) => {
  cy.contains(text).should("be.visible");
});
