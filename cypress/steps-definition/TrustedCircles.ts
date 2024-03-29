import { And, Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import moment from "moment";

import { MainNavigationMenu } from "../page-object/MainNavigationMenu";
import { TrustedCirclesPage } from "../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const mainNavigationMenu = new MainNavigationMenu();
const currentTime = moment().unix();

Given("I visit Trusted Circle page", () => {
  cy.visit("/trustedcircle");
});

Given("Go to Trusted Circle page", () => {
  cy.findByText("Trusted Circles").click();
});

When("I click on Add Trusted Circle button", () => {
  cy.url().should("not.include", "/trustedcircle/undefined"); //probably a bug of the App
  cy.url().should("include", "/trustedcircle");
  cy.get('[data-cy="loader-spinner-icon"]').should("not.exist");
  cy.get(mainNavigationMenu.getConnectedWalletButtonWithWalletAddress()).should("be.visible");
  cy.wait(2000);
  cy.get(trustedCirclesPage.getAddTrustedCircleButton()).click({ force: true });
});

Then("I click on or Create Trusted Circle button", () => {
  cy.get(trustedCirclesPage.getOrCreateTrustedCircleButton()).click();
});

And("I enter Trusted Circle name as {string}", (text) => {
  cy.get(trustedCirclesPage.getTrustedCircleNameAddressField())
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

And("I click on Add proposal button", () => {
  cy.findByText("Add proposal").click();
});

And("I select Whitelist Pair option", () => {
  cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", "New proposal");
  cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "1");
  cy.get(trustedCirclesPage.getProposalOptionDropDown()).click();
  cy.findByText("Whitelist Pair").click();
});

And("I select Trading Pair from drop down", () => {
  cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", "Whitelist Pair");
  cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "2");
  cy.wait(4000); //Wait to finishing fetch (probably bug)
  cy.get(trustedCirclesPage.getProposalOptionDropDown()).click();
  cy.get(trustedCirclesPage.getFirstItemFromDropDown()).click();
});

And("I click on Create proposal button", () => {
  cy.findByText("Create proposal").click();
  // Workaround for an issue in browser
  Cypress.on("uncaught:exception", (err) => !err.message.includes("ResizeObserver loop limit exceeded"));
});

And("I click Confirm proposal button", () => {
  cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", "Confirmation");
  cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "3");
  cy.findByRole("button", {
    name: /Confirm proposal/i,
  }).click();
});

And("I see Your transaction was approved message", () => {
  cy.findByText("Your transaction was approved!").should("be.visible");
});

And("I see created Whitelist pair proposal", () => {
  cy.findByText("Whitelist pair").should("be.visible");
});

And("I click on Whitelist pair button to open proposal", () => {
  cy.findByText("Whitelist pair").click();
});

And("I click on Execute Proposal button", () => {
  cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", 'Nº 1 "Whitelist pair"');
  cy.findByRole("button", {
    name: /Execute Proposal/i,
  }).click();
});

And("I see proposal has change state to Executed", () => {
  cy.findByText("Executed").should("be.visible");
});
