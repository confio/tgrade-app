import { CosmWasmFeeTable } from "@cosmjs/cosmwasm-launchpad";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { GasLimits, GasPrice, makeCosmoshubPath, OfflineSigner, Secp256k1HdWallet } from "@cosmjs/launchpad";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import {
  BankExtension,
  DistributionExtension,
  QueryClient,
  setupBankExtension,
  setupDistributionExtension,
  setupStakingExtension,
  StakingExtension,
} from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { configKeplr } from "config/keplr";
import { NetworkConfig } from "config/network";

// Wallet storage utils
export const storedWalletKey = "burner-wallet";
export const getWallet = (): string | null => localStorage.getItem(storedWalletKey);
export const setWallet = (wallet: string): void => localStorage.setItem(storedWalletKey, wallet);
export const isWalletEncrypted = (wallet: string): boolean => wallet.split(" ").length < 12;
export const generateMnemonic = (): string => Bip39.encode(Random.getBytes(16)).toString();

export function loadOrCreateMnemonic(): string {
  const loaded = localStorage.getItem(storedWalletKey);
  if (loaded) {
    return loaded;
  }

  const generated = generateMnemonic();
  localStorage.setItem(storedWalletKey, generated);
  return generated;
}

// Wallet creation utils
export type WalletLoader = (
  config: NetworkConfig,
  password?: string,
  mnemonic?: string,
) => Promise<OfflineSigner>;

export const loadOrCreateWallet: WalletLoader = async ({ addressPrefix }) => {
  const mnemonic = loadOrCreateMnemonic();
  if (isWalletEncrypted(mnemonic)) throw new Error("Cannot load encrypted wallet");

  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, makeCosmoshubPath(0), addressPrefix);
  return wallet;
};

export const unlockWallet: WalletLoader = async (_, password) => {
  if (!password) throw new Error("Password needed for unlocking encrypted wallet");

  const encryptedWallet = getWallet();
  if (!encryptedWallet || !isWalletEncrypted(encryptedWallet)) throw new Error("No encrypted wallet found");

  const wallet = await Secp256k1HdWallet.deserialize(encryptedWallet, password.normalize());
  return wallet;
};

export const importWallet: WalletLoader = async ({ addressPrefix }, password, mnemonic) => {
  if (!mnemonic || !password) throw new Error("Mnemonic and password needed for importing wallet");

  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, makeCosmoshubPath(0), addressPrefix);
  const serializedWallet = await wallet.serialize(password.normalize());
  setWallet(serializedWallet);

  return wallet;
};

export const loadLedgerWallet: WalletLoader = async ({ addressPrefix }) => {
  const interactiveTimeout = 120_000;
  const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);

  return new LedgerSigner(ledgerTransport, { hdPaths: [makeCosmoshubPath(0)], prefix: addressPrefix });
};

export const loadKeplrWallet: WalletLoader = async (config) => {
  const anyWindow: any = window;
  if (!anyWindow.getOfflineSigner) {
    throw new Error("Keplr extension is not available");
  }

  await anyWindow.keplr.experimentalSuggestChain(configKeplr(config));
  await anyWindow.keplr.enable(config.chainId);

  const signer = anyWindow.getOfflineSigner(config.chainId);
  signer.signAmino = signer.signAmino ?? signer.sign;

  return Promise.resolve(signer as OfflineSigner);
};

// Client creation utils
export async function createSigningClient(
  config: NetworkConfig,
  signer: OfflineSigner,
): Promise<SigningCosmWasmClient> {
  const gasLimits: GasLimits<CosmWasmFeeTable> = {
    upload: 1500000,
    init: 600000,
    exec: 400000,
    migrate: 600000,
    send: 80000,
    changeAdmin: 80000,
  };

  return SigningCosmWasmClient.connectWithSigner(config.rpcUrl, signer, {
    prefix: config.addressPrefix,
    gasPrice: GasPrice.fromString(`${config.gasPrice}${config.feeToken}`),
    gasLimits: gasLimits,
  });
}

export async function createQueryClient(
  apiUrl: string,
): Promise<QueryClient & StakingExtension & DistributionExtension & BankExtension> {
  const tmClient = await Tendermint34Client.connect(apiUrl);
  return QueryClient.withExtensions(
    tmClient,
    setupBankExtension,
    setupStakingExtension,
    setupDistributionExtension,
  );
}
