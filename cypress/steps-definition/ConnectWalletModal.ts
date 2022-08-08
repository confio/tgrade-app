import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { ConnectWalletModal } from "../page-object/ConnectWalletModal";

const connectWalletModal = new ConnectWalletModal();

// TODO move away this mnemonic to some other file storage
const mnemonicWalletWithEngagementPoints =
  "bone idea foster kid item private figure victory power reflect wrong bunker";

Given("Set wallet with Engagement Points and Engagement Rewards", async () => {
  localStorage.setItem("burner-wallet", mnemonicWalletWithEngagementPoints);
  cy.reload(); //help to apply new mnemonic and exchange address
});

And("I see my TGD balance", async () => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonicWalletWithEngagementPoints, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const { address: walletUserA } = (await wallet.getAccounts())[0];
  const signingClient_01 = await createSigningClient(config, wallet);

  const walletBalanceUser = await signingClient_01.getBalance(walletUserA, config.feeToken);
  cy.get(connectWalletModal.getTokenBalance()).should("contain.text", walletBalanceUser.amount.slice(0, 4));
});

And("I close wallet dialog modal", () => {
  cy.get(connectWalletModal.getCloseIcon()).click();
  cy.get(connectWalletModal.getCloseIcon()).should("not.exist");
});
