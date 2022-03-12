import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";

import { TrustedCirclesPage } from "../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();

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
    // workaround to wait for wallet connection
    cy.wait(4500);

    // Print Wallet mnemonic
    cy.window().its("localStorage").invoke("getItem", "burner-wallet").as("burner-wallet");
    cy.get("@burner-wallet").then((users) => {
      cy.log(`WALLET_MNEMONIC ${users}`);
      cy.task("log", `WALLET_MNEMONIC: +++++ ${users} +++++`);
    });
  });

  describe("create trusted circle (connect wallet first)", () => {
    const currentTime = new Date().getTime();
    beforeEach(() => {
      // start creating TC
      cy.findByText(/Add Trusted Circle/i).click();
      cy.findByText(/Create Trusted Circle/i).click();
      cy.findByPlaceholderText(/Enter Trusted Circle name/i)
        .type(`Trusted Circle Test #${currentTime}`)
        .should("contain.value", "Trusted Circle Test #");

      cy.get(trustedCirclesPage.getDialogHeaderName()).should("have.text", "Start Trusted Circle");
      cy.get(trustedCirclesPage.getDialogStepNumber()).should("have.text", "1");
      cy.findByRole("button", { name: /Next/i }).click();

      cy.get(trustedCirclesPage.getDialogStepNumber()).should("have.text", "2");
      cy.findByRole("button", { name: /Next/i }).click();

      cy.get(trustedCirclesPage.getDialogStepNumber()).should("have.text", "3");
      cy.findByRole("button", {
        name: /Sign transaction and pay escrow/i,
      }).click();

      cy.findByRole("button", {
        name: /Go to Trusted Circle details/i,
      })
        .click()
        .should("not.be.visible");
      cy.findByText("Your transaction was approved!").should("not.be.visible");
    });
    it("show created trusted circle load_test and drop down pagination", () => {
      cy.get(trustedCirclesPage.getTCNameFromActiveTab())
        .should("be.visible")
        .should("contain.text", "Trusted Circle Test #");
      // workaround
      cy.findByText("Your transaction was approved!").should("not.be.visible");

      cy.findByRole("tablist").then(($btn) => {
        if ($btn.hasClass(trustedCirclesPage.getPaginationThreeDots())) {
          cy.get(trustedCirclesPage.getPaginationThreeDots()).click();
          cy.get(trustedCirclesPage.getPaginationDropDown()).should("contain.text", currentTime);
        } else {
          cy.log("Pagination is not present");
        }
      });
    });

    xdescribe("add non-voting participant", () => {
      before(() => {
        cy.findByText(/Add proposal/i).click();

        // Assert
        cy.get(trustedCirclesPage.getDialogHeaderName()).should("have.text", "New proposal");
        cy.get(trustedCirclesPage.getDialogStepNumber()).should("have.text", "1");
        cy.findAllByTitle(/Add non voting participants/i).should("be.visible");

        cy.findByRole("button", { name: /Next/i }).click();

        // Add participant(s)
        cy.get(trustedCirclesPage.getDialogHeaderName()).should("have.text", "Add participant(s)");
        cy.get(trustedCirclesPage.getDialogStepNumber()).should("have.text", "2");
        // Enter random address
        const randomAddress = makeRandomAddress();
        cy.findByPlaceholderText("Type or paste addresses here").type(randomAddress);

        cy.findByRole("button", { name: /Next/i }).click();

        cy.findByRole("button", { name: /Next/i }).click();
        //cy.wait(15000);
      });
      it("show created proposal with non voting member", () => {
        //TODO
      });
    });
  });
});
