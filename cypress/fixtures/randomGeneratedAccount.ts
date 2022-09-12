import { Bip39, Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";

const generateMnemonic = (): string => Bip39.encode(Random.getBytes(16)).toString();

function makeRandomTgradeAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}

const randomAddress01 = makeRandomTgradeAddress();
const randomAddress02 = makeRandomTgradeAddress();
const randomAddress03 = makeRandomTgradeAddress();
const randomAddress04 = makeRandomTgradeAddress();
const randomAddress05 = makeRandomTgradeAddress();
const randomAddress06 = makeRandomTgradeAddress();
const randomAddress07 = makeRandomTgradeAddress();

const randomMnemonic01 = generateMnemonic();
const randomMnemonic02 = generateMnemonic();
const randomMnemonic03 = generateMnemonic();
const randomMnemonic04 = generateMnemonic();
const randomMnemonic05 = generateMnemonic();
const randomMnemonic06 = generateMnemonic();
const randomMnemonic07 = generateMnemonic();
const randomMnemonic08 = generateMnemonic();
const randomMnemonic09 = generateMnemonic();
const randomMnemonic10 = generateMnemonic();
const randomMnemonic11 = generateMnemonic();

export const selectRandomGeneratedMnemonicByNumber = (addressMnemonic: string): string => {
  switch (addressMnemonic) {
    case "randomMnemonic01":
      return randomMnemonic01;
    case "randomMnemonic02":
      return randomMnemonic02;
    case "randomMnemonic03":
      return randomMnemonic03;
    case "randomMnemonic04":
      return randomMnemonic04;
    case "randomMnemonic05":
      return randomMnemonic05;
    case "randomMnemonic06":
      return randomMnemonic06;
    case "randomMnemonic07":
      return randomMnemonic07;
    case "randomMnemonic08":
      return randomMnemonic08;
    case "randomMnemonic09":
      return randomMnemonic09;
    case "randomMnemonic10":
      return randomMnemonic10;
    case "randomMnemonic11":
      return randomMnemonic11;
    default:
      return "no mnemonic was provided";
  }
};

export const selectRandomGeneratedAddressByNumber = (number: string): string => {
  switch (number) {
    case "randomAddress01":
      return randomAddress01;
    case "randomAddress02":
      return randomAddress02;
    case "randomAddress03":
      return randomAddress03;
    case "randomAddress04":
      return randomAddress04;
    case "randomAddress05":
      return randomAddress05;
    case "randomAddress06":
      return randomAddress06;
    case "randomAddress07":
      return randomAddress07;
    default:
      return "no number was provided";
  }
};
