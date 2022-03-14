import moment from "moment";

import { TrustedCirclesPage } from "../../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const currentTime = moment().unix();

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
  });

  describe("create Asset", () => {
    beforeEach(() => {
      // Go to T-Market
      cy.visit("/tmarket/exchange");
      // click on Create Asset button
      cy.findByRole("button", { name: /Create Asset/i }).click();
      cy.findByPlaceholderText("Enter token symbol").type("BNB");
      cy.findByPlaceholderText("Enter token name").type("Binance Coin");
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
      cy.get("form > div:nth-child(1) button .sc-avest.ehypyc").click();
    });

    //Cypress._.times(20, () => {
    it("show created Asset volume_test", () => {
      // TODO
    });
    //});
  });
});
