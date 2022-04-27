import { TMarketPage } from "../../page-object/TMarketPage";
import { TrustedCirclesPage } from "../../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const tMarketPage = new TMarketPage();
const tokenSymbol = "BTC";
const tokenName = "Bitcoin";

/**
 * Volume test
 * https://confio.slab.com/posts/volume-testing-v4yvdmuz
 * */

describe("T-Market", () => {
  before(() => {
    cy.visit("/trustedcircle");

    // connect demo wallet
    cy.findByText("Connect Wallet").click();
    cy.findByText("Web wallet (demo)").click();
    cy.findByText("Loading your Wallet").should("not.exist");
    cy.get(trustedCirclesPage.getMainWalletAddress()).should("contain.text", "tgrade");
    // workaround to wait for wallet connection (critical ~4000)
    cy.wait(6500);

    cy.contains("T-Market").click();

    // Workaround for an issue in browser
    Cypress.on(
      "uncaught:exception",
      (err) => !err.message.includes("Query failed with (18): contract: not found: invalid request"),
    );
  });

  describe("create Asset", () => {
    let index = 1;
    beforeEach(() => {
      cy.findByRole("button", { name: /Create Asset/i }).click();

      cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", "Create digital asset");
      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "1");
      cy.findByPlaceholderText("Enter token symbol").type(tokenSymbol);
      cy.findByPlaceholderText("Enter token name").type(tokenName + "+" + ++index);

      cy.findByPlaceholderText("Enter initial supply").type("1000");
      cy.findByPlaceholderText("Enter decimals").type("4");

      cy.findByRole("button", { name: /Next/i }).click();

      cy.get(trustedCirclesPage.getDialogHeaderName()).should("contain.text", "Create digital asset");
      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "2");
      cy.get(tMarketPage.getModalDialogContent())
        .findByRole("button", { name: /Create asset/i })
        .click();
      cy.findByRole("button", {
        name: /Go to T-Market/i,
      }).click();
      cy.findByText("Your transaction was approved!").should("not.be.visible");
      cy.get(tMarketPage.getDropDownSelectTokenFromButton()).should("be.visible").click();
    });

    // Set number of runs here 'Cypress._.times(100, (k) => {'
    Cypress._.times(1, (k) => {
      it(`Show created Asset ${k + 1} / 100`, () => {
        let index = 1;
        const dynamicTokenName = tokenName + "+" + ++index;
        cy.get(tMarketPage.getListOfCreatedTokens()).findByText(dynamicTokenName).should("be.visible");
      });
    });

    afterEach(() => {
      cy.get(tMarketPage.getCloseModalDialogButton()).click();
    });
  });
});
