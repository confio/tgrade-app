import moment from "moment";

import { TrustedCirclesPage } from "../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const currentTime = moment().unix();

xdescribe("Trusted Circle", () => {
  beforeEach(() => {
    cy.visit("/trustedcircle");
    // connect demo wallet
    cy.findByText("Connect Wallet").click();
    cy.findByText("Web wallet (demo)").click();
    cy.findByText("Loading your Wallet").should("not.exist");
    cy.get(trustedCirclesPage.getConnectedWalletButton()).should("exist");
    // workaround to wait for wallet connection (critical ~4000)
    cy.wait(5500);
  });

  xdescribe("create trusted circle", () => {
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
    it("show that trusted circle is created", () => {
      cy.get(trustedCirclesPage.getTCNameFromActiveTab())
        .should("be.visible")
        .should("contain.text", "Trusted Circle Test #");
    });
  });

  xdescribe("add non-voting participant", () => {
    it("non-voting is created", () => {
      //TODO
    });
  });

  xdescribe("non-voting participant", () => {
    it("can trade whitelisted token pair", () => {
      //TODO
    });
  });

  xdescribe("remove non-voting participant", () => {
    it("should remove non-voting participant", () => {
      //TODO
    });
  });

  xdescribe("non-voting participant trades whitelisted token pair ", () => {
    it("show an unauthorised message and trade fails ", () => {
      //TODO
    });
  });
});
