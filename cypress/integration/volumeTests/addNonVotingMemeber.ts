import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import moment from "moment";

import { TrustedCirclesPage } from "../../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const currentTime = moment().unix();

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}

/**
 * Volume test
 * https://confio.slab.com/posts/volume-testing-v4yvdmuz
 * */

describe("Non Voting Member", () => {
  before(() => {
    cy.visit("/trustedcircle");
    // connect demo wallet
    cy.findByText("Connect Wallet").click();
    cy.findByText("Web wallet (demo)").click();
    cy.findByText("Loading your Wallet").should("not.exist");
    cy.get(trustedCirclesPage.getConnectedWalletButton()).should("exist");
    // workaround to wait for wallet connection (critical ~4000)
    // and to wait until account will be existed on chain
    cy.wait(6500);
  });

  describe("Create Trusted Circle", () => {
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
      }).click({ force: true });
      cy.findByText("Your transaction was approved!").should("not.be.visible");
    });

    it("show created TC", () => {
      cy.get(trustedCirclesPage.getTCNameFromActiveTab())
        .should("be.visible")
        .should("contain.text", "Trusted Circle Test #");
    });
  });

  // Set number of runs here 'Cypress._.times(100, (k) => {'
  Cypress._.times(1, () => {
    describe("Add non voting members", () => {
      const randomAddress = makeRandomAddress();

      before(() => {
        cy.findByText(/Add proposal/i).click();

        cy.get(trustedCirclesPage.getDialogHeaderName()).should("have.text", "New proposal");
        cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "1");
        cy.findAllByTitle(/Add non voting participants/i).should("be.visible");
        cy.findByRole("button", { name: /Next/i }).click();

        cy.get(trustedCirclesPage.getDialogHeaderName()).should("have.text", "Add participant(s)");
        cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "2");
        cy.findByPlaceholderText("Type or paste addresses here").type(randomAddress);
        cy.findByRole("button", { name: /Create proposal/i }).click();

        cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "3");
        cy.findByRole("button", { name: /Confirm proposal/i }).click();
        cy.findByRole("button", {
          name: /Go to Trusted Circle details/i,
        })
          .click({ force: true })
          .should("not.be.visible");

        // Workaround for an issue in browser
        Cypress.on(
          "uncaught:exception",
          (err) => !err.message.includes("ResizeObserver loop limit exceeded"),
        );
      });

      it("Show created proposal with non voting member", () => {
        cy.get("table tbody").within(($table) => {
          cy.wrap($table).should("contain.text", "Add participants");
        });
      });
    });
  });
});
