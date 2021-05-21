#!/usr/bin/env node
/*jshint esversion: 8 */

/* eslint-disable @typescript-eslint/naming-convention */
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { FaucetClient } from "@cosmjs/faucet-client";
import { GasPrice, makeCosmoshubPath } from "@cosmjs/launchpad";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
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

const localConfig = {
  endpoint: "http://localhost:26657",
  faucet: "http://localhost:8000",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.025utgd"),
  wasmUrl: "https://github.com/CosmWasm/cosmwasm-plus/releases/download/v0.6.0/cw20_base.wasm",
};

const config = PRODUCTION ? musselnetConfig : localConfig;

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
  const options = { prefix: config.bech32prefix, gasPrice: config.gasPrice };
  const client = await SigningCosmWasmClient.connectWithSigner(config.endpoint, wallet, options);

  // get fee tokens
  console.info("Hitting the faucet...");
  const { address } = (await wallet.getAccounts())[0];
  const faucet = new FaucetClient(config.faucet);
  await faucet.credit(address, config.feeDenom);

  const contract = "tgrade_dso.wasm";
  let wasm = fs.readFileSync(path.join(process.cwd(), "contracts", contract));
  const uploadReceipt = await client.upload(address, wasm, codeMeta, "Upload ");
  console.info(`Upload succeeded. Receipt: ${JSON.stringify(uploadReceipt)}`);
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
