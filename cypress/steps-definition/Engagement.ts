import { Bip39, Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { And } from "cypress-cucumber-preprocessor/steps";

import { config } from "../../src/config/network";
import { createSigningClient } from "../../src/utils/sdk";
import { EngagementPage } from "../page-object/EngagementPage";

const engagementPage = new EngagementPage();

const generateMnemonic = (): string => Bip39.encode(Random.getBytes(16)).toString();
const randomMnemonicFirst = generateMnemonic();
const randomMnemonicSecond = generateMnemonic();

const randomFirstAddress = makeRandomTgradeAddress();
const randomSecondAddress = makeRandomTgradeAddress();
const randomThirdAddress = makeRandomTgradeAddress();
const randomFourthAddress = makeRandomTgradeAddress();

const selectRandomGeneratedMnemonicByNumber = (addressMnemonic: string): string => {
  switch (addressMnemonic) {
    case "randomMnemonicFirst":
      return randomMnemonicFirst;
    case "randomMnemonicSecond":
      return randomMnemonicSecond;
    default:
      return "no mnemonic was provided";
  }
};

const selectRandomGeneratedAddressByNumber = (number: string): string => {
  switch (number) {
    case "randomFirst":
      return randomFirstAddress;
    case "randomSecond":
      return randomSecondAddress;
    case "randomThird":
      return randomThirdAddress;
    case "randomFourth":
      return randomFourthAddress;
    default:
      return "no number was provided";
  }
};

enum ExistingAddresses {
  adminAccount = "tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3", // admin account
  firstAccount = "tgrade10jdqrtm46xsxtdmuyt2zfcrhupvycrpv80r7nh", // node0 with Tokens
  secondAccount = "tgrade1aw7g4pxlzmj85fwhd3zs5hhgs0a9xeqg28z8jl", // node0 with Tokens
  thirdAccount = "tgrade1dzav7m7r42sg02sqdvqelazsg0mu5ef0qjpq5e", // node0 with Tokens
  fourthAccount = "tgrade1kjeuxlg02ku900mzddhrvpc2cjgaaen90czgg8", // node0 with Tokens
  fifthAccount = "tgrade1kwh2efsmue7pms3930gsclr224k8c7uwke5jvd", // node0 with Tokens
  sixthAccount = "tgrade1vl76n4q0pfk2ek07tz2cd5vnlvkuf5tnznqed5", // node0 with Tokens
}

const selectWalletAddressByNumber = (walletNumber: string): string => {
  switch (walletNumber) {
    case "adminAccount":
      return ExistingAddresses.adminAccount;
    case "firstAccount":
      return ExistingAddresses.firstAccount;
    case "secondAccount":
      return ExistingAddresses.secondAccount;
    case "thirdAccount":
      return ExistingAddresses.thirdAccount;
    case "fourthAccount":
      return ExistingAddresses.fourthAccount;
    case "fifthAccount":
      return ExistingAddresses.fifthAccount;
    case "sixthAccount":
      return ExistingAddresses.sixthAccount;
    default:
      return "no wallet number was provided";
  }
};

enum Mnemonics {
  adminMnemonic = "bone idea foster kid item private figure victory power reflect wrong bunker",
  firstMnemonic = "move drastic law sustain decade parent stairs minor cry help worry minute bridge bone force found mimic frown burst foil avocado water kingdom picture",
  secondMnemonic = "cancel fault concert check match goose auto item judge couch exist shop mango option sister edit maze wide praise tortoise memory right post unusual",
  thirdMnemonic = "pink neutral tray meadow pet caught cereal pass test swarm edge junior cradle all split matrix siege squeeze hobby fence act human patrol ramp",
  fourthMnemonic = "shell display fetch burst pear naive hip box nose gallery unlock sign surprise ancient elite girl winter disorder wish list maximum galaxy twenty rather",
  fifthMnemonic = "enroll collect warm liar allow symbol topic reveal forget cute layer lens crucial wheat remind unknown barrel piece horror depend quarter position adjust clog",
  sixthMnemonic = "wink trophy quit belt rely corn style cupboard mix price abstract sentence joy column half woman thank firm mushroom lamp into hockey diary inside",
}

const selectMnemonicByNumber = (mnemonicAddress: string): string => {
  switch (mnemonicAddress) {
    case "adminMnemonic":
      return Mnemonics.adminMnemonic;
    case "firstMnemonic":
      return Mnemonics.firstMnemonic;
    case "secondMnemonic":
      return Mnemonics.secondMnemonic;
    case "thirdMnemonic":
      return Mnemonics.thirdMnemonic;
    case "fourthMnemonic":
      return Mnemonics.fourthMnemonic;
    case "fifthMnemonic":
      return Mnemonics.fifthMnemonic;
    case "sixthMnemonic":
      return Mnemonics.sixthMnemonic;
    default:
      return "no mnemonic was provided";
  }
};

And('I see the "Address" field prefilled with my {string} wallet', (walletNumber) => {
  const address = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getInitialAddressInputField()).should("have.value", address);
});

And('I enter {string} address in the "Receiver address" field', (randomNumber) => {
  const randomAddress = selectRandomGeneratedAddressByNumber(randomNumber);
  cy.get(engagementPage.getReceiverAddressInputField()).type(randomAddress);
});

And('I enter existing {string} address in the "Receiver address" field', (orderNumber) => {
  const existingAddress = selectWalletAddressByNumber(orderNumber);
  cy.get(engagementPage.getReceiverAddressInputField()).type(existingAddress);
});

And('I see no any address in the "Receiver address" field', async () => {
  cy.get(engagementPage.getReceiverAddressInputField()).should("have.value", "");
});

And(
  "I see my Engagement Points {string} and Engagement Rewards {string} TGD",
  (engagementPoint, engagementRewards) => {
    // TODO instead of hardcoded value, make a query to get current
    cy.get(engagementPage.getEngagementPointsValue()).should("contain.text", engagementPoint);
    cy.get(engagementPage.getEngagementRewardsValue()).should("contain.text", engagementRewards);
  },
);

And('I click on the "Withdraw rewards" button', () => {
  cy.get(engagementPage.getWithdrawRewardsButton()).click();
});

And("I see Tx success screen with {string} address", (walletNumber) => {
  const walletAddress = selectRandomGeneratedAddressByNumber(walletNumber);
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", walletAddress);
});

And("I see Tx success screen with existing {string} address", (walletNumber) => {
  const walletAddress = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", walletAddress);
});

And("I click Go to Engagement button", () => {
  cy.get(engagementPage.getTransactionResultScreenGoToEngagementButton()).click();
});

And("I type {string} address in Delegated withdrawal to field", (walletNumber) => {
  const accountAddress = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).clear().type(accountAddress);
});

And(
  "I use {string} mnemonic of receive address to query balance {string}",
  async (receiveMnemonicAddress, tokenBalance) => {
    const addressMnemonic = selectRandomGeneratedMnemonicByNumber(receiveMnemonicAddress);
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(addressMnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const { address: walletUserA } = (await wallet.getAccounts())[0];
    const signingClient_01 = await createSigningClient(config, wallet);

    const walletBalanceUser = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(walletBalanceUser.amount.slice(0, 3)).to.contains(tokenBalance);
  },
);

And(
  "I use existing {string} mnemonic of receive address to query balance {string}",
  async (receiveAddressMnemonic, tokenBalance) => {
    const addressMnemonic = selectMnemonicByNumber(receiveAddressMnemonic);
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(addressMnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const { address: walletUserA } = (await wallet.getAccounts())[0];
    const signingClient_01 = await createSigningClient(config, wallet);

    const walletBalanceUser = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(walletBalanceUser.amount.slice(0, 3)).to.contains(tokenBalance);
  },
);

And('I click the "Set delegate" button', () => {
  cy.get(engagementPage.getSetDelegateButton()).click();
});

And("I see Tx success screen with {string} delegated address", (addressNumber) => {
  const walletAddress = selectWalletAddressByNumber(addressNumber);
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", walletAddress);
});

And("I see Tx success screen with initial {string} delegated address", (walletNumber) => {
  const address = selectWalletAddressByNumber(walletNumber);
  cy.get(engagementPage.getTransactionResultScreenText()).should(
    "have.text",
    "Your transaction was approved!",
  );
  cy.get(engagementPage.getTransactionResultScreenDetails()).should("contain.text", address);
});

And("I see there is random {string} address set in Delegate withdrawal field", (addressNumber) => {
  const randomAddress = selectRandomGeneratedAddressByNumber(addressNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", randomAddress);
});

And("I see there is existing {string} address set in Delegate withdrawal field", (addressNumber) => {
  const randomAddress = selectWalletAddressByNumber(addressNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", randomAddress);
});

And("I see Delegate withdrawal to field is pre-field with existing {string} address", (address) => {
  const preFieldAddress = selectWalletAddressByNumber(address);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", preFieldAddress);
});

And("I see Delegate withdrawal to field is pre-field with {string} address", (addressNumber) => {
  const walletAddress = selectWalletAddressByNumber(addressNumber);
  cy.get(engagementPage.getDelegatedWithdrawalToField()).should("have.value", walletAddress);
});

And("I set {string} address to initial Address field", (addressNumber) => {
  const randomAddress = selectRandomGeneratedAddressByNumber(addressNumber);
  cy.get(engagementPage.getInitialAddressInputField()).clear().type(randomAddress);
});

And("I click on the Clear delegate button", () => {
  cy.get(engagementPage.getClearDelegateButton()).click();
});

And("I see I can no longer withdraw rewards for the initial account", () => {
  cy.get(engagementPage.getDisabledWithdrawRewardsButton()).should("be.disabled");
});

function makeRandomTgradeAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
