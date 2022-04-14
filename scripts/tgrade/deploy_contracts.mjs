#!/usr/bin/env node
/*jshint esversion: 8 */

/* eslint-disable @typescript-eslint/naming-convention */
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice, makeCosmoshubPath } from "@cosmjs/stargate";
import * as fs from "fs";
import * as path from "path";

const networkConfig = {
  endpoint: "https://rpc.dryrunnet.tgrade.confio.run",
  faucet: "https://faucet.dryrunnet.tgrade.confio.run",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.05utgd"),
};

const localConfig = {
  endpoint: "https://rpc.dryrunnet.tgrade.confio.run",
  faucet: "https://faucet.dryrunnet.tgrade.confio.run",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.05utgd"),
};

const config = process.argv[2] === "network" ? networkConfig : localConfig;

async function main() {
  // build signing client
  const mnemonic = Bip39.encode(Random.getBytes(16)).toString();
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.bech32prefix,
  });
  const options = { prefix: config.bech32prefix };
  const client = await SigningCosmWasmClient.connectWithSigner(config.endpoint, wallet, options);

  // get fee tokens
  console.info("Hitting the faucet...");
  const { address } = (await wallet.getAccounts())[0];
  const faucet = new FaucetClient(config.faucet);
  await faucet.credit(address, config.feeDenom);
  console.info("...done");

  //CW20-base - codeid: 10
  console.info("Uploading CW20 Base wasm...");
  const cw20 = "cw20_base.wasm";
  let wasmCW20 = fs.readFileSync(path.join(process.cwd(), "contracts", cw20));
  const uploadReceiptCW20 = await client.upload(
    address,
    wasmCW20,
    calculateFee(25000000, config.gasPrice),
    "upload cw20 wasm",
  );
  console.info(`Upload CW20-base Contract succeeded. Receipt: ${JSON.stringify(uploadReceiptCW20)}`);

  //Trusted token: 11
  console.info("Uploading trusted token wasm...");
  const dsoToken = "trusted_token.wasm";
  let wasmDsoToken = fs.readFileSync(path.join(process.cwd(), "contracts", dsoToken));
  const uploadReceiptDsoToken = await client.upload(
    address,
    wasmDsoToken,
    calculateFee(25000000, config.gasPrice),
    "upload trusted token wasm",
  );
  console.info(`Upload trusted token Contract succeeded. Receipt: ${JSON.stringify(uploadReceiptDsoToken)}`);

  //factory: 12
  console.info("Uploading TFI Factory wasm...");
  const factory = "tfi_factory.wasm";
  let wasmFactory = fs.readFileSync(path.join(process.cwd(), "contracts", factory));
  const uploadReceiptFactory = await client.upload(
    address,
    wasmFactory,
    calculateFee(25000000, config.gasPrice),
    "upload factory wasm",
  );
  console.info(`Upload Factory Contract succeeded. Receipt: ${JSON.stringify(uploadReceiptFactory)}`);

  // Pair Contract: 13
  console.info("Uploading TFI Pair wasm...");
  const pair = "tfi_pair.wasm";
  let wasmPair = fs.readFileSync(path.join(process.cwd(), "contracts", pair));
  const uploadReceiptPair = await client.upload(
    address,
    wasmPair,
    calculateFee(25000000, config.gasPrice),
    "upload pair wasm",
  );
  console.info(`Upload Pair Contract succeeded. Receipt: ${JSON.stringify(uploadReceiptPair)}`);

  const codes = await client.getCodes();
  console.info("codes", codes);
}

main().then(
  () => {
    console.info("All done, let the tgrade flow.");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
