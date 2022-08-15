import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And, Given } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { selectMnemonicByNumber, selectWalletAddressByNumber } from "../accounts";
import { ConnectWalletModal } from "../page-object/ConnectWalletModal";
import { ValidatorDetailsDialog } from "../page-object/ValidatorDetailsDialog";

const connectWalletModal = new ConnectWalletModal();
const validatorDetailsDialog = new ValidatorDetailsDialog();

Given("Set {string} wallet with Engagement Points and Engagement Rewards", async (walletNumber) => {
  const mnemonic = selectMnemonicByNumber(walletNumber);
  localStorage.setItem("burner-wallet", mnemonic);
  cy.reload(); //workaround help to apply new mnemonic and exchange address
});

And("I see my TGD balance in wallet {string}", async (walletNumber) => {
  const mnemonic = selectMnemonicByNumber(walletNumber);
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

And("I see that TGD balance {string} has gone up for {string} address", (tokenBalance, accountAddress) => {
  const selectedAccountAddress = selectWalletAddressByNumber(accountAddress);
  cy.get(validatorDetailsDialog.getAddressTooltipTagHash()).should("contain.text", selectedAccountAddress);
  cy.get(connectWalletModal.getTokenBalance()).should("contain.text", tokenBalance);
});
