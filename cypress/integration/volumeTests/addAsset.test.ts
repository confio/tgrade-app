import { TrustedCirclesPage } from "../../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const tokenSymbol = "BTC";
const tokenName = "Bitcoin";

describe("T-Market", () => {
  before(() => {
    cy.visit("/trustedcircle");
    //cy.get(trustedCirclesPage.getCookiesAcceptButton()).click();
    // connect demo wallet
    cy.findByText("Connect Wallet").click();
    cy.findByText("Web wallet (demo)").click();
    cy.findByText("Loading your Wallet").should("not.exist");
    cy.get(trustedCirclesPage.getMainWalletAddress()).should("contain.text", "tgrade");
    // workaround to wait for wallet connection (critical ~4000)
    cy.wait(4500);
    // Go to T-Market
    cy.visit("/tmarket/exchange");
  });

  describe("create Asset", () => {
    let index = 1;
    beforeEach(() => {
      // click on Create Asset button
      cy.findByRole("button", { name: /Create Asset/i }).click();
      cy.findByPlaceholderText("Enter token symbol").type(tokenSymbol);
      cy.findByPlaceholderText("Enter token name").type(tokenName + "+" + ++index);
      // TODO enter logo URL
      cy.findByPlaceholderText("Enter initial supply").type("1000");
      cy.findByPlaceholderText("Enter decimals").type("4");
      // TODO add assrtion for "Your token will look like:" value
      cy.findByRole("button", { name: /Next/i }).click();
      // TODO check dialog header
      cy.get(".ant-modal-content")
        .findByRole("button", { name: /Create asset/i })
        .click();
      cy.findByRole("button", {
        name: /Go to T-Market/i,
      }).click();
      cy.findByText("Your transaction was approved!").should("not.be.visible");
      // Click on drop down select a token
      cy.get('form > div:nth-child(1) button [alt="Down arrow select token"]').should("be.visible").click();
    });
    Cypress._.times(20, () => {
      it("show created Asset volume_test", () => {
        let index = 1;
        const dynamicTokenName = tokenName + "+" + ++index;
        cy.get("ul.ant-list-items").findByText(dynamicTokenName).should("be.visible");
      });
    });

    afterEach(() => {
      cy.get('[alt="Close button"]').click();
    });
  });
});
