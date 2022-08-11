import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { ConnectWalletModal } from "../page-object/ConnectWalletModal";

const connectWalletModal = new ConnectWalletModal();

// TODO move away this mnemonic to some other file storage
const mnemonicFirstWalletWithEngagementPoints =
  "bone idea foster kid item private figure victory power reflect wrong bunker";
const mnemonicSecondWalletWithEngagementPoints =
  "cancel fault concert check match goose auto item judge couch exist shop mango option sister edit maze wide praise tortoise memory right post unusual";

const mnemonicThirdWalletWithEngagementPoints =
  "move drastic law sustain decade parent stairs minor cry help worry minute bridge bone force found mimic frown burst foil avocado water kingdom picture";

const selectMnemonic = (walletNumber: string): string => {
  switch (walletNumber) {
    case "first":
      return mnemonicFirstWalletWithEngagementPoints;
    case "second":
      return mnemonicSecondWalletWithEngagementPoints;
    case "third":
      return mnemonicThirdWalletWithEngagementPoints;
    default:
      return "no mnemonic was provided";
  }
};

Given("Set {string} wallet with Engagement Points and Engagement Rewards", async (walletNumber) => {
  const mnemonic = selectMnemonic(walletNumber);
  console.log(mnemonic);
  localStorage.setItem("burner-wallet", mnemonic);
  cy.reload(); //help to apply new mnemonic and exchange address
});

And("I see my TGD balance in wallet {string}", async (walletNumber) => {
  const mnemonic = selectMnemonic(walletNumber);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const { address: walletUserA } = (await wallet.getAccounts())[0];
  const signingClient_01 = await createSigningClient(config, wallet);

  const walletBalanceUser = await signingClient_01.getBalance(walletUserA, config.feeToken);
  cy.get(connectWalletModal.getTokenBalance()).should("contain.text", walletBalanceUser.amount.slice(0, 3));
});

And("I close wallet dialog modal", () => {
  cy.get(connectWalletModal.getCloseIcon()).click();
  cy.get(connectWalletModal.getCloseIcon()).should("not.exist");
});
