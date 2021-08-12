#!/usr/bin/env node
/*jshint esversion: 8 */

/* eslint-disable @typescript-eslint/naming-convention */
import { defaultGasLimits, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice, makeCosmoshubPath } from "@cosmjs/stargate";
import * as fs from "fs";
import * as path from "path";

const PRODUCTION = false;

const musselnetConfig = {
  endpoint: "https://rpc.musselnet.cosmwasm.com",
  faucet: "https://faucet.musselnet.cosmwasm.com",
  bech32prefix: "wasm",
  feeDenom: "umayo",
  gasPrice: GasPrice.fromString("0.025umayo"),
  wasmUrl: "https://github.com/CosmWasm/cosmwasm-plus/releases/download/v0.6.0/cw20_base.wasm",
};

const tgradeinternal = {
  endpoint: "https://rpc.internal-1.tgrade.io",
  faucet: "https://faucet.internal-1.tgrade.io",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.025utgd"),
  wasmUrl: "https://github.com/CosmWasm/cosmwasm-plus/releases/download/v0.6.0/cw20_base.wasm",
};

const localConfig = {
  endpoint: "http://localhost:26657",
  faucet: "http://localhost:8000",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.025utgd"),
  wasmUrl: "https://github.com/CosmWasm/cosmwasm-plus/releases/download/v0.6.0/cw20_base.wasm",
};

const config = PRODUCTION ? tgradeinternal : localConfig;

const codeMeta = {
  source: "https://github.com/confio/tgrade-contracts/releases",
  builder: "cosmwasm/workspace-optimizer:0.10.x",
};

async function main() {
  // build signing client
  const mnemonic = Bip39.encode(Random.getBytes(16)).toString();
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.bech32prefix,
  });
  const gasLimits = { ...defaultGasLimits, upload: 5_000_000 };
  const options = { prefix: config.bech32prefix, gasPrice: config.gasPrice, gasLimits };
  const client = await SigningCosmWasmClient.connectWithSigner(config.endpoint, wallet, options);

  // get fee tokens
  console.info("Hitting the faucet...");
  const { address } = (await wallet.getAccounts())[0];
  const faucet = new FaucetClient(config.faucet);
  await faucet.credit(address, config.feeDenom);

  //tgrade_dso
  const contract = "tgrade_dso.wasm";
  let wasm = fs.readFileSync(path.join(process.cwd(), "contracts", contract));
  const uploadReceipt = await client.upload(address, wasm, calculateFee(2500000, config.gasPrice), "Upload ");
  console.info(`Upload succeeded. Receipt: ${JSON.stringify(uploadReceipt)}`);

  //factory
  console.log("Uploading TFI Factory wasm");
  const factory = "tfi_factory.wasm";
  let wasmFactory = fs.readFileSync(path.join(process.cwd(), "contracts", factory));
  const uploadReceiptFactory = await client.upload(address, wasmFactory, codeMeta, "Upload ");
  console.info(`Upload Factory Contract succeeded. Receipt: ${JSON.stringify(uploadReceiptFactory)}`);

  // Pair Contract
  const pair = "tfi_pair.wasm";
  let wasmPair = fs.readFileSync(path.join(process.cwd(), "contracts", pair));
  const uploadReceiptPair = await client.upload(address, wasmPair, codeMeta, "Upload ");
  console.info(`Upload Pair Contract succeeded. Receipt: ${JSON.stringify(uploadReceiptPair)}`);

  // //CW20-base
  const cw20 = "cw20_base.wasm";
  let wasmCW20 = fs.readFileSync(path.join(process.cwd(), "contracts", cw20));
  const uploadReceiptCW20 = await client.upload(address, wasmCW20, codeMeta, "Upload ");
  console.info(`Upload CW20-base succeeded. Receipt: ${JSON.stringify(uploadReceiptCW20)}`);

  const codes = await client.getCodes();
  console.log("codes", codes);
}

main().then(
  () => {
    console.info("All done, let the DSO flow.");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
