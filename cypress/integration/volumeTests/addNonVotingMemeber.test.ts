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

describe("Trusted Circle", () => {
  before(() => {
    cy.visit("/trustedcircle");
    // connect demo wallet
    cy.findByText("Connect Wallet").click();
    cy.findByText("Web wallet (demo)").click();
    cy.findByText("Loading your Wallet").should("not.exist");
    cy.get(trustedCirclesPage.getMainWalletAddress()).should("contain.text", "tgrade");
  });

  describe("Create Trusted Circle", () => {
    before(() => {
      cy.visit("/trustedcircle");

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
      cy.wait(2500); //workaround should be improved
      cy.findByRole("button", {
        name: /Sign transaction and pay escrow/i,
      }).click();

      cy.findByRole("button", {
        name: /Go to Trusted Circle details/i,
      })
        .click()
        .should("not.be.visible");
      //workaround to don't see `Your transaction was approved!` second time
      cy.wait(2500);
      cy.findByText("Your transaction was approved!").should("not.be.visible");
    });
    it("show created TC", () => {
      cy.get(trustedCirclesPage.getTCNameFromActiveTab())
        .should("be.visible")
        .should("contain.text", "Trusted Circle Test #");
    });
  });

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
      cy.wait(2500);
      cy.findByRole("button", { name: /Create proposal/i }).click();

      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "3");
      cy.findByRole("button", { name: /Confirm proposal/i }).click();
      cy.findByRole("button", {
        name: /Go to Trusted Circle details/i,
      })
        .click()
        .should("not.be.visible");
      //workaround to don't see `Your transaction was approved!` second time
      cy.wait(2500);
      cy.findByText("Your transaction was approved!").should("not.be.visible");
    });

    it("Show created proposal with non voting member", () => {
      //TODO
      // blocked by https://github.com/confio/tgrade-app/issues/477
    });
  });
});
