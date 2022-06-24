import moment from "moment";

import { TrustedCirclesPage } from "../../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const currentTime = moment().unix();

/**
 * Volume test
 * https://confio.slab.com/posts/volume-testing-v4yvdmuz
 * */

describe("Trusted Circle", () => {
  before(() => {
    cy.visit("/trustedcircle");
    // connect demo wallet
    cy.findByText("Connect Wallet").click();
    cy.findByText("Web wallet (demo)").click();
    cy.findByText("Loading your Wallet").should("not.exist");
    cy.get(trustedCirclesPage.getMainWalletAddress()).should("contain.text", "tgrade");
    // workaround to wait for wallet connection (critical ~4000)
    cy.wait(6500);
    cy.findByText("Trusted Circles").click();
  });

  describe("create trusted circle", () => {
    beforeEach(() => {
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
      }).click();
      cy.findByText("Your transaction was approved!").should("not.be.visible");
    });

    // Set number of runs here 'Cypress._.times(100, (k) => {'
    Cypress._.times(1, (k) => {
      it(`Show created Trusted Circle and select first TC in pagination ${k + 1} / 100`, () => {
        cy.get(trustedCirclesPage.getTCNameFromActiveTab())
          .should("be.visible")
          .should("contain.text", "Trusted Circle Test #");

        cy.findByRole("tablist").then(($btn) => {
          if ($btn.find(trustedCirclesPage.getHiddenPaginationThreeDots()).length > 0) {
            cy.log("Pagination is not present");
          } else {
            cy.get(trustedCirclesPage.getPaginationDropDown()).click();
            cy.findByRole("listbox").should("contain.text", currentTime);
            cy.get(trustedCirclesPage.getFirstTCbyOrderNumberInListBox(1)).click();
          }
        });
        // workaround should be removed
        cy.findByText("Your transaction was approved!").should("not.be.visible");
      });
    });
  });
});
