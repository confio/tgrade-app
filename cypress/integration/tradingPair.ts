import moment from "moment";

import { TMarketPage } from "../page-object/TMarketPage";
import { TrustedCirclesPage } from "../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const currentTime = moment().unix();
const tMarketPage = new TMarketPage();
const tokenSymbol = "SUST";
const tokenName = "Test Sustainability Asset";

/**
 * https://medium.com/tgradefinance/create-a-trusted-circle-add-a-digital-asset-permission-the-trading-pair-and-trade-in-tgrade-4636c0dde367
 * */

describe("Trading Pair", () => {
  before(() => {
    cy.visit("/trustedcircle");
    // connect demo wallet
    cy.findByText("Connect Wallet").click();
    cy.findByText("Web wallet (demo)").click();
    cy.findByText("Loading your Wallet").should("not.exist");
    cy.get(trustedCirclesPage.getMainWalletAddress()).should("contain.text", "tgrade");
    // workaround to wait for wallet connection (critical ~4000)
    cy.wait(5500);
  });

  describe("Create Trusted circle", () => {
    before(() => {
      cy.findByText(/Add Trusted Circle/i).click();
      cy.findByText(/Create Trusted Circle/i).click();
      cy.findByPlaceholderText(/Enter Trusted Circle name/i)
        .type("Trusted Circle Test #" + currentTime)
        .should("contain.value", "Trusted Circle Test #");
      cy.get(trustedCirclesPage.getDialogHeaderName()).should("have.text", "Start Trusted Circle");
      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "1");
      cy.findByRole("button", { name: /Next/i }).click();

      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "2");
      cy.findByRole("button", { name: /Next/i }).click();

      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "3");
      cy.findByRole("button", {
        name: /Sign transaction and pay escrow/i,
      }).click();

      cy.findByText("Your transaction was approved!").should("be.visible");

      cy.findByRole("button", {
        name: /Go to Trusted Circle details/i,
      }).click({ force: true });
      cy.findByText("Your transaction was approved!").should("not.be.visible");
    });

    it("Show created Trusted Circle", () => {
      cy.get(trustedCirclesPage.getTCNameFromActiveTab())
        .should("be.visible")
        .should("contain.text", "Trusted Circle Test #");
      // workaround! should be removed
      cy.findByText("Your transaction was approved!").should("not.be.visible");
    });
  });

  describe("Create the trading pair", () => {
    let tsContract: string;
    let index = 1;
    // generate random token name
    const dynamicTokenName = tokenName + "+" + ++index;
    before(() => {
      // Extract tcAddress from current TC
      cy.get(trustedCirclesPage.getCurrentTrustedCircleAddress()).then((tcAddress) => {
        tsContract = tcAddress.text();
      });
    });

    it("Create a Digital Asset and associate it with my Trusted Circle", () => {
      // Go to T-Market page
      cy.findByText("T-Market").click();
      cy.findByRole("button", { name: /Create Asset/i }).click();

      // Step #1
      cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", "Create digital asset");
      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "1");
      cy.findByPlaceholderText("Enter token symbol").type(tokenSymbol);
      cy.findByPlaceholderText("Enter token name").type(dynamicTokenName);

      cy.findByPlaceholderText("Enter initial supply").type("1000");
      cy.findByPlaceholderText("Enter decimals").type("1");

      cy.findByRole("button", { name: /Next/i }).click();

      // Step #2
      cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", "Create digital asset");
      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "2");
      cy.findByPlaceholderText("Enter address").type(tsContract);

      cy.get(tMarketPage.getModalDialogContent())
        .findByRole("button", { name: /Create asset/i })
        .click()
        .should("not.exist");

      // Extract created token Address
      cy.get(tMarketPage.getYourTransactionWasApprovedContent()).then((path) => {
        const extractedText = path.text();
        const getTokenAddress = extractedText.match(/\((.*)\)/g)[0].replace(/[()]/g, "");
        cy.wrap(getTokenAddress).as("tokenAddress");
      });

      cy.findByRole("button", {
        name: /Go to T-Market/i,
      }).click();

      cy.findByText("Your transaction was approved!").should("not.be.visible");
      cy.findByText("Provide Liquidity").click();

      // Select token FROM
      cy.get(tMarketPage.getDropDownSelectTokenFromButton()).click();
      cy.get(tMarketPage.getListOfTokens()).findByText("TGD").click();

      // Select TO
      cy.get(tMarketPage.getDropDownSelectTokenToButton()).click();

      cy.get(tMarketPage.getTokenOnPinnedTabByName(dynamicTokenName))
        .last() // because there is another dialog rendered behind
        .click({ force: true });
      cy.findByText("Create Pair").click();
      cy.findByLabelText("estimated-message").should(
        "have.text",
        "The displaying number is the simulated result and can be different from the actual swap rate. Trade at your own risk.",
      );
    });
  });
});
