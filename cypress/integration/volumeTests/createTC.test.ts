import moment from "moment";

import { TrustedCirclesPage } from "../../page-object/TrustedCirclesPage";

const trustedCirclesPage = new TrustedCirclesPage();
const currentTime = moment().unix();

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

      cy.findByRole("button", {
        name: /Go to Trusted Circle details/i,
      })
        .click()
        .should("not.be.visible");
      cy.findByText("Your transaction was approved!").should("not.be.visible");
    });

    //Cypress._.times(20, () => {
    it("show created Trusted Circle and select first TC in pagination volume_test", () => {
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
    //});
  });
});
