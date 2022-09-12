import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { OcContract } from "../../src/utils/oversightCommunity";
import { createSigningClient } from "../../src/utils/sdk";
import { selectMnemonicByNumber } from "../fixtures/existingAccounts";
import { selectRandomGeneratedMnemonicByNumber } from "../fixtures/randomGeneratedAccount";
import { OcClaimBackYourEscrowModal } from "../page-object/OcClaimBackYourEscrowModal";
import { OversightCommunityPage } from "../page-object/OversightCommunityPage";

const oversightCommunityPage = new OversightCommunityPage();
const ocClaimBackYourEscrowModal = new OcClaimBackYourEscrowModal();

And("I click on the gear icon and on Leave Oversight Community", () => {
  cy.get(oversightCommunityPage.getGearLeaveIcon()).click();
  cy.get(oversightCommunityPage.getLeaveOversightCommunityOption()).click();
});

And("I click on Leave button in Leave OC modal", () => {
  cy.get(oversightCommunityPage.getOcModalLeaveButton()).click();
});

And("I see {string} because I am member of OC", (memberState) => {
  cy.contains(memberState).should("be.visible");
});

And("I see {string} because I am not a member anymore", (memberState) => {
  cy.reload(); //Workaround to see the changes (probably a bug)
  cy.contains(memberState).should("be.visible");
});

And("I see the address of the OC", () => {
  cy.get(oversightCommunityPage.getOversightCommunityAddress()).should("contain.text", "tgrade1");
});

And("I click on the address of the OC", () => {
  cy.get(oversightCommunityPage.getOversightCommunityAddress()).click();
  Cypress.on("uncaught:exception", (err) => !err.message.includes("The request is not allowed"));
  Cypress.on("uncaught:exception", (err) => !err.message.includes("The error you provided"));
  Cypress.on("uncaught:exception", (err) => !err.message.includes("Document is not focused"));
  // Both try catch is workaround for unknown error comes from cypress
  cy.contains("Address Copied").should("be.visible");
});

And("I check that my clipboard now contains the address of the OC", () => {
  // Workaround to grand permission to compare copied address
  cy.wrap(
    Cypress.automation("remote:debugger:protocol", {
      command: "Browser.grantPermissions",
      params: {
        permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
        // make the permission tighter by allowing the current origin only
        // on "http://localhost:3000"
        origin: window.location.origin,
      },
    }),
  );

  cy.get(oversightCommunityPage.getOversightCommunityAddress()).then(($element) => {
    const extractedAddress = $element.text();
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq(extractedAddress);
      });
    });
  });
});

And("I see the current voting rules for the Oversight Community", () => {
  cy.get(oversightCommunityPage.getVotingRulesQuorumValue()).should("contain.text", "51.00%");
  cy.get(oversightCommunityPage.getVotingRulesThresholdValue()).should("contain.text", "55.00%");
  cy.get(oversightCommunityPage.getVotingRulesVotingDurationValue()).should("contain.text", "30 days");
  cy.get(oversightCommunityPage.getVotingRulesVotingToEndEarlyValue()).should("contain.text", "Yes");
  cy.get(oversightCommunityPage.getVotingRulesMinimumEscrowValue()).should("contain.text", "1 TGD");
});

And("I see the half-life data for the Oversight Community", () => {
  cy.get(oversightCommunityPage.getEngagementHalfLifeDurationValue()).should("contain.text", "180 days");
});

And("Execute proposal in OC with {string} member", async (randomMnemonic) => {
  const selectedRandomMnemonic = selectRandomGeneratedMnemonicByNumber(randomMnemonic);
  await executeProposeWithRandomMember(selectedRandomMnemonic);
});

And("I don't see Add proposal button available", () => {
  cy.get(oversightCommunityPage.getAddProposalButton()).should("not.exist");
});

And("I click on Deposit escrow button", () => {
  cy.get(oversightCommunityPage.getDepositEscrowButton()).click();
});

And("I see how much escrow {string} I need to deposit in the Deposit escrow modal", (requiredEscrow) => {
  cy.get(oversightCommunityPage.getRequiredEscrowValue()).should("have.text", requiredEscrow);
});

And("I enter {string} escrow to Escrow amount field", (escrowAmount) => {
  cy.get(oversightCommunityPage.getEscrowAmountField()).clear().type(escrowAmount);
});

And("I click Pay escrow button", () => {
  cy.get(oversightCommunityPage.getPayEscrowButton()).click();
});

And("I see Add proposal button is available", () => {
  cy.reload(); //Bug issues/844
  cy.get(oversightCommunityPage.getAddProposalButton()).should("be.visible");
});

And('I click on "Claim escrow" button', () => {
  cy.get(oversightCommunityPage.getClaimEscrowButton()).click();
});

And(
  "I see required {string}, current {string} and escrow I can claim {string}",
  (requiredValue, currentValue, youCanClaimValue) => {
    cy.get(ocClaimBackYourEscrowModal.getRequiredEscrowValue()).should("have.text", requiredValue);
    cy.get(ocClaimBackYourEscrowModal.getYourCurrentEscrowValue()).should("have.text", currentValue);
    cy.get(ocClaimBackYourEscrowModal.getEscrowYouCanClaim()).should("have.text", youCanClaimValue);
  },
);

And('I click on the "Claim escrow" button', () => {
  cy.get(ocClaimBackYourEscrowModal.getClaimEscrowButton()).click();
});

And("I check that I still have voting rights", () => {
  cy.get(oversightCommunityPage.getAddProposalButton()).should("be.visible");
});

async function executeProposeWithRandomMember(randomMnemonic: string) {
  const mnemonic = selectMnemonicByNumber("adminAccount");
  const comment = "Add new member with random generated mnemonic";

  const adminWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const wallet_member = await DirectSecp256k1HdWallet.fromMnemonic(randomMnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  await createSigningClient(config, wallet_member);
  const addressRandomMember = (await wallet_member.getAccounts())[0].address;

  const signingClient = await createSigningClient(config, adminWallet);
  const { address } = (await adminWallet.getAccounts())[0];

  const OcCommunity = new OcContract(config, signingClient);

  const oC = await OcCommunity.propose(address, comment, {
    add_voting_members: {
      voters: [addressRandomMember],
    },
  });

  if (!oC.proposalId) return;
  await OcCommunity.executeProposal(address, oC.proposalId);
}
