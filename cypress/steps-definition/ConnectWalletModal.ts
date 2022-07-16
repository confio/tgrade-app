import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { ConnectWalletModal } from "../page-object/ConnectWalletModal";

const connectWalletModal = new ConnectWalletModal();

// TODO move away this mnemonic to some other file storage
const walletWithEngagementPoints =
  "bone idea foster kid item private figure victory power reflect wrong bunker";

Given("Set wallet with Engagement Points and Engagement Rewards", () => {
  localStorage.setItem("burner-wallet", walletWithEngagementPoints);
  cy.reload(); //help to apply new mnemonic and exchange address
});

And("I see my TGD balance {string}", (tokenBalance) => {
  cy.get(connectWalletModal.getTokenBalance()).should("contain.text", tokenBalance);
});

And("I close wallet dialog modal", () => {
  cy.get(connectWalletModal.getCloseIcon()).click();
});
