enum Mnemonics {
  firstMnemonic = "move drastic law sustain decade parent stairs minor cry help worry minute bridge bone force found mimic frown burst foil avocado water kingdom picture",
  secondMnemonic = "cancel fault concert check match goose auto item judge couch exist shop mango option sister edit maze wide praise tortoise memory right post unusual",
  thirdMnemonic = "pink neutral tray meadow pet caught cereal pass test swarm edge junior cradle all split matrix siege squeeze hobby fence act human patrol ramp",
  fourthMnemonic = "shell display fetch burst pear naive hip box nose gallery unlock sign surprise ancient elite girl winter disorder wish list maximum galaxy twenty rather",
  fifthMnemonic = "enroll collect warm liar allow symbol topic reveal forget cute layer lens crucial wheat remind unknown barrel piece horror depend quarter position adjust clog",
  sixthMnemonic = "wink trophy quit belt rely corn style cupboard mix price abstract sentence joy column half woman thank firm mushroom lamp into hockey diary inside",
}

enum ExistingAddresses {
  adminAccount = "tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3", // admin account
  firstAccount = "tgrade10jdqrtm46xsxtdmuyt2zfcrhupvycrpv80r7nh", // node0 with Tokens
  secondAccount = "tgrade1aw7g4pxlzmj85fwhd3zs5hhgs0a9xeqg28z8jl", // node0 with Tokens
  thirdAccount = "tgrade1dzav7m7r42sg02sqdvqelazsg0mu5ef0qjpq5e", // node0 with Tokens
  fourthAccount = "tgrade1kjeuxlg02ku900mzddhrvpc2cjgaaen90czgg8", // node0 with Tokens
  fifthAccount = "tgrade1kwh2efsmue7pms3930gsclr224k8c7uwke5jvd", // node0 with Tokens
  sixthAccount = "tgrade1vl76n4q0pfk2ek07tz2cd5vnlvkuf5tnznqed5", // node0 with Tokens
}

export const selectWalletAddressByNumber = (walletNumber: string): string => {
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

export const selectMnemonicByNumber = (mnemonicAddress: string): string => {
  switch (mnemonicAddress) {
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
