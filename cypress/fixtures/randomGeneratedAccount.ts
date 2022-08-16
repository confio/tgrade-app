import { Bip39, Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";

const generateMnemonic = (): string => Bip39.encode(Random.getBytes(16)).toString();

function makeRandomTgradeAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}

const randomMnemonicFirst = generateMnemonic();
const randomMnemonicSecond = generateMnemonic();
const randomMnemonicThird = generateMnemonic();
const randomMnemonicFourth = generateMnemonic();
const randomMnemonicFifth = generateMnemonic();
const randomMnemonicSixth = generateMnemonic();

const randomFirstAddress = makeRandomTgradeAddress();
const randomSecondAddress = makeRandomTgradeAddress();
const randomThirdAddress = makeRandomTgradeAddress();
const randomFourthAddress = makeRandomTgradeAddress();
const randomFifthAddress = makeRandomTgradeAddress();
const randomSixthAddress = makeRandomTgradeAddress();

export const selectRandomGeneratedMnemonicByNumber = (addressMnemonic: string): string => {
  switch (addressMnemonic) {
    case "randomMnemonicFirst":
      return randomMnemonicFirst;
    case "randomMnemonicSecond":
      return randomMnemonicSecond;
    case "randomMnemonicThird":
      return randomMnemonicThird;
    case "randomMnemonicFourth":
      return randomMnemonicFourth;
    case "randomMnemonicFifth":
      return randomMnemonicFifth;
    case "randomMnemonicSixth":
      return randomMnemonicSixth;
    default:
      return "no mnemonic was provided";
  }
};

export const selectRandomGeneratedAddressByNumber = (number: string): string => {
  switch (number) {
    case "randomAddressFirst":
      return randomFirstAddress;
    case "randomAddressSecond":
      return randomSecondAddress;
    case "randomAddressThird":
      return randomThirdAddress;
    case "randomAddressFourth":
      return randomFourthAddress;
    case "randomAddressFifth":
      return randomFifthAddress;
    case "randomAddressSixth":
      return randomSixthAddress;
    default:
      return "no number was provided";
  }
};
