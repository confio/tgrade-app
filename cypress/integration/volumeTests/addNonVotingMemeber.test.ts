import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import moment from "moment";

import { TrustedCirclesPage } from "../../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const currentTime = moment().unix();

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}

describe("Trusted Circle", () => {
  before(() => {
    cy.visit("/trustedcircle");
    cy.get(trustedCirclesPage.getCookiesAcceptButton()).click();
    // connect demo wallet
    cy.findByText("Connect Wallet").click();
    cy.findByText("Web wallet (demo)").click();
    cy.findByText("Loading your Wallet").should("not.exist");
    cy.get(trustedCirclesPage.getMainWalletAddress()).should("contain.text", "tgrade");
    // workaround to wait for wallet connection (critical ~4000)
    cy.wait(4500);

    // Print Wallet mnemonic
    cy.window().its("localStorage").invoke("getItem", "burner-wallet").as("burner-wallet");
    cy.get("@burner-wallet").then((users) => {
      cy.log(`WALLET_MNEMONIC ${users}`);
      cy.task("log", `WALLET_MNEMONIC: +++++ ${users} +++++`);
    });

    // Creat TC
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

    cy.findByRole("button", {
      name: /Go to Trusted Circle details/i,
    })
      .click()
      .should("not.be.visible");
    cy.findByText("Your transaction was approved!").should("not.be.visible");
    cy.get(trustedCirclesPage.getTCNameFromActiveTab())
      .should("be.visible")
      .should("contain.text", "Trusted Circle Test #");
  });

  describe("add 100 non voting members", () => {
    before(() => {
      cy.findByText(/Add proposal/i).click();

      // Assert
      cy.get(trustedCirclesPage.getDialogHeaderName()).should("have.text", "New proposal");
      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "1");
      cy.findAllByTitle(/Add non voting participants/i).should("be.visible");

      cy.findByRole("button", { name: /Next/i }).click();

      // Add participant(s)
      cy.get(trustedCirclesPage.getDialogHeaderName()).should("have.text", "Add participant(s)");
      cy.get(trustedCirclesPage.getDialogStepActiveNumber()).should("have.text", "2");
      // Enter random address
      const randomAddress = makeRandomAddress();
      cy.findByPlaceholderText("Type or paste addresses here").type(randomAddress);
      cy.findByRole("button", { name: /Next/i }).click();
    });

    //Cypress._.times(20, () => {
    it("show created proposal with non voting member volume_test", () => {
      //TODO
    });
    //});
  });
});
