import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { selectWalletAddressByNumber } from "../fixtures/existingAccounts";
import { selectRandomGeneratedMnemonicByNumber } from "../fixtures/randomGeneratedAccount";
import { DistributedRewardsDialog } from "../page-object/DistributedRewardsDialog";

const distributedRewardsDialog = new DistributedRewardsDialog();

And(
  "I see Distributed Points {string} and Distributed Rewards {string} TGD",
  (expectedPoints, expectedRewards) => {
    cy.wait(3000); //Workaround wait until calculation will be finished
    cy.get(distributedRewardsDialog.getDistributedPointsValue()).should(($element) => {
      const extractedTokenValue = parseInt($element.text());
      expect(extractedTokenValue).to.be.not.lessThan(parseInt(expectedPoints));
    });

    cy.get(distributedRewardsDialog.getDistributedRewardsValue()).should(($element) => {
      const extractedTokenValue = parseInt($element.text());
      expect(extractedTokenValue).to.be.not.lessThan(parseInt(expectedRewards));
    });
  },
);

And("I click on Withdraw rewards button", () => {
  cy.get(distributedRewardsDialog.getWithdrawRewardsButton()).click();
});

And("I click on Go to Validator details button", () => {
  cy.get(distributedRewardsDialog.getGoToValidatorDetailsButton()).click();
  cy.wait(3000); //Workaround wait until transaction will be finished
});

And('I see initial "Address" field is pre-filled with {string} in the dialog', (validatorAddress) => {
  const selectedValidatorAddress = selectWalletAddressByNumber(validatorAddress);
  cy.get(distributedRewardsDialog.getInitialValidatorAddressField()).should(
    "have.value",
    selectedValidatorAddress,
  );
});

And(
  'I enter address in the "Receiver address" field from {string} wallet distributed dialog',
  async (mnemonicNumber) => {
    const randomAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(mnemonicNumber);
    cy.get(distributedRewardsDialog.getReceiverAddressField()).type(randomAddress);
  },
);

And(
  "I enter address from {string} in Delegated withdrawal to field on Distributed rewards dialog",
  async (walletNumber) => {
    const accountAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(walletNumber);
    cy.get(distributedRewardsDialog.getDelegatedWithdrawalToField()).clear().type(accountAddress);
  },
);

And('I click on the "Withdraw rewards" button in the dialog', () => {
  cy.get(distributedRewardsDialog.getWithdrawRewardsButton()).click();
});

And('I click the "Set delegate" button on Distributed rewards dialog', () => {
  cy.get(distributedRewardsDialog.getSetDelegateButton()).click();
});

And(
  "I see Delegate field is pre-field with address from {string} on Distributed rewards dialog",
  async (addressNumber) => {
    const walletAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(addressNumber);
    cy.get(distributedRewardsDialog.getDelegatedWithdrawalToField()).should("have.value", walletAddress);
  },
);

async function returnAddressOfRandomGeneratedMnemonicByNumber(mnemonicNumber: string) {
  const generatedMnemonic = selectRandomGeneratedMnemonicByNumber(mnemonicNumber);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(generatedMnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });
  const walletAddress = (await wallet.getAccounts())[0].address;
  const signingClient = await createSigningClient(config, wallet);

  const walletBalanceUser = await signingClient.getBalance(walletAddress, config.feeToken);
  expect(walletBalanceUser.amount).to.contains(0);
  return walletAddress;
}
