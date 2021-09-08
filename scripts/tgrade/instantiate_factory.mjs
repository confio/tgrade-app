#!/usr/bin/env node
/*jshint esversion: 8 */

/* eslint-disable @typescript-eslint/naming-convention */
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice, makeCosmoshubPath } from "@cosmjs/stargate";

const localConfig = {
  endpoint: "http://localhost:26657",
  faucet: "http://localhost:8000",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.025utgd"),
  gasLimitCreateFactory: 500_000,
  cw20LiquidityCodeId: 6,
  factoryCodeId: 8,
  pairCodeId: 9,
};

const config = localConfig;

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

  // Instantiate a factory
  const { contractAddress: factoryAddress } = await client.instantiate(
    address,
    config.factoryCodeId,
    {
      pair_code_id: config.pairCodeId,
      token_code_id: config.cw20LiquidityCodeId,
    },
    "instantiate factory",
    calculateFee(config.gasLimitCreateFactory, config.gasPrice),
  );

  console.info(`Factory instantiated with address: ${factoryAddress}`);
}

main().then(
  () => {
    console.info("Factory ready!");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
