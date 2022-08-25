import { And } from "cypress-cucumber-preprocessor/steps";

import { TMarketPage } from "../page-object/TMarketPage";
import { TrustedCirclesPage } from "../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const tMarketPage = new TMarketPage();
const tokenSymbol = "SUST";
const tokenName = "Test Sustainability Asset";

And("I click on Create Asset button", () => {
  cy.findByRole("button", { name: /Create Asset/i }).click();
});

And("I enter token Symbol", () => {
  cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", "Create digital asset");
  cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "1");
  cy.findByPlaceholderText("Enter token symbol").type(tokenSymbol);
});

And("I enter token Name", () => {
  cy.findByPlaceholderText("Enter token name").type(tokenName);
});

And("I enter Initial supply {string}", (value) => {
  cy.findByPlaceholderText("Enter initial supply").type(value);
});

And("I enter decimals {string}", (value) => {
  cy.findByPlaceholderText("Enter decimals").type(value);
});

And("I click Next button", () => {
  cy.findByRole("button", { name: /Next/i }).click();
});

And("I enter Trusted Circle address", () => {
  cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", "Create digital asset");
  cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "2");

  cy.get("@trustedCircleAddress").then((tsContract: any) => {
    cy.findByPlaceholderText("Enter address").type(tsContract);
  });
});

And("I click on Create Asset button in modal dialog", () => {
  cy.get(tMarketPage.getModalDialogContent())
    .findByRole("button", { name: /Create asset/i })
    .click()
    .should("not.exist");
  extractTokenAddress();
});

const extractTokenAddress = () => {
  // Extract created token Address
  // This function can go to support/commands.ts file
  cy.get(tMarketPage.getYourTransactionWasApprovedContent()).then((path) => {
    const extractedText = path.text();
    const getTokenAddress = extractedText.match(/\((.*)\)/g)[0].replace(/[()]/g, "");
    cy.wrap(getTokenAddress).as("tokenAddress");
  });
};

And("I click on Go to T-Market button", () => {
  cy.findByRole("button", {
    name: /Go to T-Market/i,
  }).click();

  cy.findByText("Your transaction was approved!").should("not.be.visible");
});

And("I click on Provide Liquidity tab", () => {
  cy.findByText("Provide Liquidity").click();
});

And("I click on Exchange tab", () => {
  cy.findByText("Exchange").click();
  cy.url().should("include", "/tmarket/exchange");
});

And("I select TGD token FROM drop down", () => {
  cy.get(tMarketPage.getDropDownSelectTokenFromButton()).click();
  cy.get(tMarketPage.getListOfTokens()).findByText("TGD").click();
});

And("I select my created token in TO drop down", () => {
  cy.get(tMarketPage.getDropDownSelectTokenToButton()).click();
  // TODO add token verification
  cy.get(tMarketPage.getTokenOnPinnedTabByName(tokenName))
    .last() // because there is another dialog rendered behind
    .click({ force: true });
});

And("I click on Create Pair button", () => {
  cy.findByText("Create Pair").click();
  cy.findByText("Provide").should("be.visible");
});

And("I enter value for TGN token {string}", (value) => {
  // workaround to prevent of failing step
  cy.wait(4000);
  cy.get(tMarketPage.getFieldNumberFromAssetA()).type(value);
});

And("I enter value for TGN token {string} Exchange tab", (value) => {
  // workaround to prevent of failing step
  cy.wait(4000);
  cy.get(tMarketPage.getFromFieldNumber()).type(value);
});

And("I see amount of my token {string} Exchange tab", (value) => {
  cy.get(tMarketPage.getToFieldNumber()).should("have.value", value);
  cy.findByText("Minimum Received:").should("be.visible");
});

And("I enter value for my created token {string}", (value) => {
  cy.get(tMarketPage.getFieldNumberFromAssetB()).type(value);
});

And("I click on Provide button", () => {
  cy.findByText("Provide").click();
});

And("I click on Swap button", () => {
  cy.findByRole("button", { name: /Swap/i }).click();
});

And("I click on Approve SUST button", () => {
  cy.findByText("Approve SUST").click().should("not.exist");
});

And("I see Complete message", () => {
  cy.findByText("Complete!").click();
});

And("I click Ok button", () => {
  cy.get(tMarketPage.getOkButton()).click().should("not.exist");
});

And("I redirected back to Provided Liquidity tab", () => {
  cy.url().should("include", "/tmarket/provide", { timeout: 3000 }); //workaround to fix failed step
});
