import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { selectWalletAddressByNumber } from "../fixtures/existingAccounts";
import {
  selectRandomGeneratedAddressByNumber,
  selectRandomGeneratedMnemonicByNumber,
} from "../fixtures/randomGeneratedAccount";
import { DistributedRewardsDialog } from "../page-object/DistributedRewardsDialog";

const distributedRewardsDialog = new DistributedRewardsDialog();

And(
  "I see Distributed Points {string} and Distributed Rewards {string} TGD in Distributed rewards dialog",
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
  'I enter address in the "Receiver address" field from {string} wallet in Distributed rewards dialog',
  async (mnemonicNumber) => {
    const randomAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(mnemonicNumber);
    cy.get(distributedRewardsDialog.getReceiverAddressField()).clear().type(randomAddress);
  },
);

And(
  "I enter address from {string} in Delegated withdrawal to field in Distributed rewards dialog",
  async (walletNumber) => {
    const accountAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(walletNumber);
    cy.get(distributedRewardsDialog.getDelegatedWithdrawalToField())
      .wait(2000)
      .should("have.text", "")
      .clear()
      .type(accountAddress);
  },
);

And('I click on the "Withdraw rewards" button in Distributed rewards dialog', () => {
  cy.get(distributedRewardsDialog.getWithdrawRewardsButton()).click();
});

And('I click the "Set delegate" button in Distributed rewards dialog', () => {
  cy.get(distributedRewardsDialog.getSetDelegateButton()).click();
});

And(
  "I see Delegate field is pre-field with address from {string} in Distributed rewards dialog",
  async (addressNumber) => {
    const walletAddress = await returnAddressOfRandomGeneratedMnemonicByNumber(addressNumber);
    cy.get(distributedRewardsDialog.getDelegatedWithdrawalToField()).should("have.value", walletAddress);
  },
);

And("I see Delegate field is pre-field with address {string} in Distributed rewards dialog", (address) => {
  const selectedValidatorAddress = selectWalletAddressByNumber(address);
  cy.get(distributedRewardsDialog.getDelegatedWithdrawalToField()).should(
    "have.value",
    selectedValidatorAddress,
  );
});

And("I enter {string} address to initial Address field of Distributed rewards dialog", (addressNumber) => {
  const randomAddress = selectRandomGeneratedAddressByNumber(addressNumber);
  cy.get(distributedRewardsDialog.getInitialValidatorAddressField()).clear().type(randomAddress);
});

And(
  "I enter existing {string} address to initial Address field in Distributed rewards dialog",
  (addressNumber) => {
    const existingAddress = selectWalletAddressByNumber(addressNumber);
    cy.get(distributedRewardsDialog.getInitialValidatorAddressField()).clear().type(existingAddress);
  },
);

And('I click on the "Clear delegate" button in Distributed rewards dialog', () => {
  cy.get(distributedRewardsDialog.getClearDelegateButton()).click();
});

async function returnAddressOfRandomGeneratedMnemonicByNumber(mnemonicNumber: string) {
  const generatedMnemonic = selectRandomGeneratedMnemonicByNumber(mnemonicNumber);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(generatedMnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });
  const walletAddress = (await wallet.getAccounts())[0].address;
  const signingClient = await createSigningClient(config, wallet);

  const walletBalanceUser = await signingClient.getBalance(walletAddress, config.feeToken);
  expect(parseInt(walletBalanceUser.amount)).to.be.not.lessThan(0);
  return walletAddress;
}
