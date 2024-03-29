#!/usr/bin/env node
/*jshint esversion: 8 */

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice, makeCosmoshubPath } from "@cosmjs/stargate";

/*
Usage:
  1. Configure the network in which to instantiate the factory by filling the networkConfig object accordingly.
  2. Run "./instantiate_factory.mjs network" and copy the generated factory address.
  3. Hardcode that address in src/config/network.ts.
*/

const networkConfig = { // Get this information from Miguel
  endpoint: "https://rpc.dryrunnet.tgrade.confio.run",
  faucet: "https://faucet.dryrunnet.tgrade.confio.run",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.05utgd"),
  gasLimitCreateFactory: 500_000,
  cw20LiquidityCodeId: 13,
  factoryCodeId: 15,
  pairCodeId: 16,
};

const localConfig = {
  endpoint: "http://localhost:26657",
  faucet: "http://localhost:8000",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.05utgd"),
  gasLimitCreateFactory: 500_000,
  cw20LiquidityCodeId: 10,
  factoryCodeId: 12,
  pairCodeId: 13,
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

  const validatorVotingAddress = process.env.VALIDATOR_VOTING_ADDRESS;

  console.info(`Validator Voting address: ${validatorVotingAddress}`);

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
    { admin: validatorVotingAddress },
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
