import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import { DirectSecp256k1HdWallet, isOfflineDirectSigner, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { configKeplr } from "config/keplr";
import { NetworkConfig } from "config/network";
import { isChrome, isDesktop } from "react-device-detect";

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
) => Promise<OfflineDirectSigner | LedgerSigner>;

export const loadOrCreateWallet: WalletLoader = async ({ addressPrefix }) => {
  const mnemonic = loadOrCreateMnemonic();
  if (isWalletEncrypted(mnemonic)) throw new Error("Cannot load encrypted wallet");

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: addressPrefix,
  });
  return wallet;
};

export const unlockWallet: WalletLoader = async (_, password) => {
  if (!password) throw new Error("Password needed for unlocking encrypted wallet");

  const encryptedWallet = getWallet();
  if (!encryptedWallet || !isWalletEncrypted(encryptedWallet)) throw new Error("No encrypted wallet found");

  const wallet = await DirectSecp256k1HdWallet.deserialize(encryptedWallet, password.normalize());
  return wallet;
};

export const importWallet: WalletLoader = async ({ addressPrefix }, password, mnemonic) => {
  if (!mnemonic || !password) throw new Error("Mnemonic and password needed for importing wallet");

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: addressPrefix,
  });
  const serializedWallet = await wallet.serialize(password.normalize());
  setWallet(serializedWallet);

  return wallet;
};

export const loadLedgerWallet: WalletLoader = async ({ addressPrefix }) => {
  const interactiveTimeout = 120_000;
  const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);

  return new LedgerSigner(ledgerTransport, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: addressPrefix,
  });
};

export const loadKeplrWallet: WalletLoader = async (config) => {
  if (!window.keplr || !window.getOfflineSigner) {
    throw new Error("Keplr extension is not available");
  }

  await window.keplr.experimentalSuggestChain(configKeplr(config));
  await window.keplr.enable(config.chainId);

  // Type declaration because isOfflineDirectSigner is not narrowing type
  const signer: OfflineDirectSigner = window.getOfflineSigner(config.chainId);
  if (!isOfflineDirectSigner(signer)) {
    throw new Error("Got amino signer instead of direct");
  }

  return Promise.resolve(signer);
};

export function isKeplrSigner(signer?: OfflineDirectSigner | LedgerSigner): signer is OfflineDirectSigner {
  return !!(signer as any)?.keplr;
}

export function isLedgerSigner(signer?: OfflineDirectSigner | LedgerSigner): signer is LedgerSigner {
  return !!(signer as any)?.ledger;
}

export function isKeplrAvailable(): boolean {
  const canGetSigner = !!window.getOfflineSigner;
  const canSuggestChain = !!window.keplr?.experimentalSuggestChain;
  return canGetSigner && canSuggestChain;
}

export function isLedgerAvailable(): boolean {
  const anyNavigator: any = navigator;
  return anyNavigator?.usb && isChrome && isDesktop;
}

// Client creation utils
export async function createClient(apiUrl: string): Promise<CosmWasmClient> {
  const cwClient = await CosmWasmClient.connect(apiUrl);
  return cwClient;
}

export async function createSigningClient(
  config: NetworkConfig,
  signer: OfflineDirectSigner | LedgerSigner,
): Promise<SigningCosmWasmClient> {
  return SigningCosmWasmClient.connectWithSigner(config.rpcUrl, signer, {
    prefix: config.addressPrefix,
  });
}
