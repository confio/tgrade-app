import { And, Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import moment from "moment";

import { TrustedCirclesPage } from "../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const currentTime = moment().unix();

Given("I visit Trusted Circle page", () => {
  cy.visit("/trustedcircle");
});

Then("I connect to Web Demo wallet", () => {
  cy.findByText("Connect Wallet").click();
  cy.findByText("Web wallet (demo)").click();
  cy.findByText("Loading your Wallet").should("not.exist");
  cy.get(trustedCirclesPage.getMainWalletAddress()).should("contain.text", "tgrade");
  // workaround to wait for wallet connection (critical ~4000)
  cy.wait(5500);
});

When("I click on Add Trusted Circle button", () => {
  cy.findByText(/Add Trusted Circle/i).click();
});

Then("I click on Create Trusted Circle button", () => {
  cy.findByText(/Create Trusted Circle/i).click();
});

And("I enter Trusted Circle name as {string}", (text) => {
  cy.findByPlaceholderText(/Enter Trusted Circle name/i)
    .type(text + currentTime)
    .should("contain.value", "My Trusted Circle #");
});

And("I click on Next button Step#1 in modal dialog", () => {
  cy.get(trustedCirclesPage.getDialogHeaderName()).should("have.text", "Start Trusted Circle");
  cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "1");
  cy.findByRole("button", { name: /Next/i }).click();
});

And("I click on Next button Step#2 in modal dialog", () => {
  cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "2");
  cy.findByRole("button", { name: /Next/i }).click();
});

And("I click on Sign transaction and pay escrow button on Step#3", () => {
  cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "3");
  cy.findByRole("button", {
    name: /Sign transaction and pay escrow/i,
  }).click();
});

And("I see Your transaction was approved! message", () => {
  cy.findByText("Your transaction was approved!").should("be.visible");
});

And("I click on Go to Trusted Circle details button", () => {
  cy.findByRole("button", {
    name: /Go to Trusted Circle details/i,
  }).click({ force: true });
  cy.findByText("Your transaction was approved!").should("not.be.visible");
});
And("I see that {string} is created", (text) => {
  cy.get(trustedCirclesPage.getTCNameFromActiveTab()).should("be.visible").should("contain.text", text);
  // workaround! should be removed
  cy.findByText("Your transaction was approved!").should("not.be.visible");

  cy.get(trustedCirclesPage.getCurrentTrustedCircleAddress()).then((tcAddress) => {
    const tsContract = tcAddress.text();
    cy.wrap(tsContract).as("trustedCircleAddress");
  });
});
