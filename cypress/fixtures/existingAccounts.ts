enum Mnemonics {
  adminMnemonic = "bone idea foster kid item private figure victory power reflect wrong bunker",
  node0Mnemonic = "fox orange tiger coach ski arm shrimp scrub quote reason visa better wait drift program burst mind assault develop canvas inspire battle odor visit",
  node1Mnemonic = "merit daring radio hospital exchange kitten skirt cry seven evil faculty lion cup inherit live host stable tuna convince tip blur sphere curve search",
  firstMnemonic = "move drastic law sustain decade parent stairs minor cry help worry minute bridge bone force found mimic frown burst foil avocado water kingdom picture",
  secondMnemonic = "cancel fault concert check match goose auto item judge couch exist shop mango option sister edit maze wide praise tortoise memory right post unusual",
  thirdMnemonic = "pink neutral tray meadow pet caught cereal pass test swarm edge junior cradle all split matrix siege squeeze hobby fence act human patrol ramp",
  fourthMnemonic = "shell display fetch burst pear naive hip box nose gallery unlock sign surprise ancient elite girl winter disorder wish list maximum galaxy twenty rather",
  fifthMnemonic = "enroll collect warm liar allow symbol topic reveal forget cute layer lens crucial wheat remind unknown barrel piece horror depend quarter position adjust clog",
  sixthMnemonic = "wink trophy quit belt rely corn style cupboard mix price abstract sentence joy column half woman thank firm mushroom lamp into hockey diary inside",
}

enum ExistingAddresses {
  adminAccount = "tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3",
  node0Account = "tgrade1tsg4wldpwyehhkqx3za78ygkzatncxxup96k7h",
  node1Account = "tgrade12ty7w05kswvuvvzzdxdv8w4tf7g6y9xexy5rzj",
  firstAccount = "tgrade10jdqrtm46xsxtdmuyt2zfcrhupvycrpv80r7nh",
  secondAccount = "tgrade1aw7g4pxlzmj85fwhd3zs5hhgs0a9xeqg28z8jl",
  thirdAccount = "tgrade1dzav7m7r42sg02sqdvqelazsg0mu5ef0qjpq5e",
  fourthAccount = "tgrade1kjeuxlg02ku900mzddhrvpc2cjgaaen90czgg8",
  fifthAccount = "tgrade1kwh2efsmue7pms3930gsclr224k8c7uwke5jvd",
  sixthAccount = "tgrade1vl76n4q0pfk2ek07tz2cd5vnlvkuf5tnznqed5",
}

enum ValidatorName {
  node0Account = "moniker-0",
  node1Account = "delme",
}

export const selectValidatorNameByAddressNumber = (accountNumber: string): string => {
  switch (accountNumber) {
    case "node0Account":
      return ValidatorName.node0Account;
    case "node1Account":
      return ValidatorName.node1Account;
    default:
      return "no address number was provided";
  }
};

export const selectWalletAddressByNumber = (walletNumber: string): string => {
  switch (walletNumber) {
    case "node0Account":
      return ExistingAddresses.node0Account;
    case "node1Account":
      return ExistingAddresses.node1Account;
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
    case "adminAccount":
      return Mnemonics.adminMnemonic;
    case "node0Mnemonic":
      return Mnemonics.node0Mnemonic;
    case "node1Mnemonic":
      return Mnemonics.node1Mnemonic;
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
