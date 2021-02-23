#!/usr/bin/env node
/*jshint esversion: 8 */

/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";
import { Bip39, Random } from "@cosmjs/crypto";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/launchpad";

const PRODUCTION = false;

const musselnetConfig = {
  endpoint: "https://rpc.musselnet.cosmwasm.com",
  faucet: "https://faucet.musselnet.cosmwasm.com",
  bech32prefix: "wasm",
  feeDenom: "umayo",
  gasPrice: GasPrice.fromString("0.025umayo"),
  wasmUrl: "https://github.com/CosmWasm/cosmwasm-plus/releases/download/v0.5.0/cw20_base.wasm",
};

const localConfig = {
  endpoint: "http://localhost:26657",
  faucet: "http://localhost:8000",
  bech32prefix: "wasm",
  feeDenom: "ucosm",
  gasPrice: GasPrice.fromString("0.025ucosm"),
  wasmUrl: "https://github.com/CosmWasm/cosmwasm-plus/releases/download/v0.5.0/cw20_base.wasm",
};

const config = PRODUCTION ? musselnetConfig : localConfig;

const codeMeta = {
  source: "https://github.com/CosmWasm/cosmwasm-plus/tree/v0.5.0/contracts/cw20-base",
  builder: "cosmwasm/workspace-optimizer:0.10.7",
};

const addresses = [
  "wasm1lk46aknye76sgfv65v5zcyyld0fnuu5jg02hs8",
  "wasm13crj2rx0hqar8rjn3zp0xl4tqw6ec7tpmmtxyu",
  "wasm1kw62mwcjy74myqc0xxp2573fpm0kkfhdhqx0cx",
  "wasm17kcwckd3v8ryyxk8qe6lc8sp9jxf63u963wrsq",
  "wasm1d4ut3z9c0kplgz5ma9t6ee637tagjqfykfpnd5",
  "wasm1eldfm7jktevnscwr6prdravd8yuq7j87q6d9vx"
];

const initDataHash = {
  admin: undefined,
  initMsg: {
    decimals: 5,
    name: "Hash token",
    symbol: "HASH",
    initial_balances: addresses.map((address) => ({
      address,
      amount: "123456",
    })),
  },
};
const initDataIsa = {
  admin: undefined,
  initMsg: {
    decimals: 0,
    name: "Isa Token",
    symbol: "ISA",
    initial_balances: addresses.map((address) => ({
      address,
      amount: "8008",
    })),
  },
};
const initDataJade = {
  initMsg: {
    decimals: 18,
    name: "Jade Token",
    symbol: "JADE",
    initial_balances: addresses.map((address) => ({
      address,
      amount: "1002003004005006007",
    })),
  },
};

async function downloadWasm(url) {
  const r = await axios.get(url, { responseType: "arraybuffer" });
  if (r.status !== 200) {
    throw new Error(`Download error: ${r.status}`);
  }
  return r.data;
}

async function main() {
  // build signing client
  const mnemonic = Bip39.encode(Random.getBytes(16)).toString();
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, undefined, config.bech32prefix);
  const options = { prefix: config.bech32prefix, gasPrice: config.gasPrice };
  const client = await SigningCosmWasmClient.connectWithSigner(config.endpoint, wallet, options);

  // get fee tokens
  console.info("Hitting the faucet...");
  const { address } = (await wallet.getAccounts())[0];
  const faucet = new FaucetClient(config.faucet);
  await faucet.credit(address, config.feeDenom);

  console.info(`Downloading ${config.wasmUrl}...`);
  const wasm = await downloadWasm(config.wasmUrl);
  const uploadReceipt = await client.upload(address, wasm, codeMeta, "Upload CW-20 Base");
  console.info(`Upload succeeded. Receipt: ${JSON.stringify(uploadReceipt)}`);

  for (const { initMsg } of [initDataHash, initDataIsa, initDataJade]) {
    const { contractAddress } = await client.instantiate(
      address,
      uploadReceipt.codeId,
      initMsg,
      initMsg.symbol,
      {
        memo: `Create an CW20 instance for ${initMsg.symbol}`,
        // admin: admin,
      },
    );
    console.info(`Contract instantiated for ${initMsg.symbol} at ${contractAddress}`);
  }
}

main().then(
  () => {
    console.info("All done, let the coins flow.");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
