#!/usr/bin/env node
/*jshint esversion: 8 */

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { toBase64, toUtf8 } from "@cosmjs/encoding";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice, makeCosmoshubPath } from "@cosmjs/stargate";

/*
Usage:
  1. Configure the network in which to instantiate the factory by filling the networkConfig object accordingly.
  2. Run "./instantiate_factory.mjs network" and copy the generated factory address.
  3. Hardcode that address in src/config/network.ts.
*/

const networkConfig = {
  // Get this information from Miguel
  endpoint: "https://rpc.dryrunnet.tgrade.confio.run",
  faucet: "https://faucet.dryrunnet.tgrade.confio.run",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.05utgd"),
  gasLimit: 500_000,
  multisigCodeId: 17,
  apVotingCodeId: 18,
};

const localConfig = {
  endpoint: "http://localhost:26657",
  faucet: "http://localhost:8000",
  bech32prefix: "tgrade",
  feeDenom: "utgd",
  gasPrice: GasPrice.fromString("0.05utgd"),
  gasLimit: 500_000,
  multisigCodeId: 14,
  apVotingCodeId: 15,
};

const config = process.argv[2] === "network" ? networkConfig : localConfig;

async function main() {
  // build signing client
  const mnemonic =
    "fox orange tiger coach ski arm shrimp scrub quote reason visa better wait drift program burst mind assault develop canvas inspire battle odor visit";
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

  const apVotingAddress = process.env.AP_VOTING_ADDRESS;
  const validatorVotingAddress = process.env.VALIDATOR_VOTING_ADDRESS;

  console.info(`Arbiter Pool Voting address: ${apVotingAddress}`);
  console.info(`Validator Voting address: ${validatorVotingAddress}`);

  // Propose a migration
  const migrateProposalMsg = {
    propose: {
      title: "Migrate contract",
      description: "Migrate Arbiter Pool Voting to new Code ID to set multisig",
      proposal: {
        migrate_contract: {
          contract: apVotingAddress,
          code_id: config.apVotingCodeId,
          migrate_msg: toBase64(
            toUtf8(`{ "multisig_code": ${config.multisigCodeId}, "waiting_period": 60 }`),
          ),
        },
      },
    },
  };

  const { logs } = await client.execute(
    address,
    validatorVotingAddress,
    migrateProposalMsg,
    calculateFee(config.gasLimit, config.gasPrice),
  );

  // Vote for the proposal
  const proposalIdAttr = logs
    .flatMap((log) => log.events)
    .flatMap((event) => event.attributes)
    .find((attr) => attr.key === "proposal_id");

  const proposalId = proposalIdAttr ? Number(proposalIdAttr.value) : 0;

  /* const voteProposalMsg = { vote: { proposal_id: proposalId, vote: "yes" } };
  await client.execute(
    address,
    validatorVotingAddress,
    voteProposalMsg,
    calculateFee(config.gasLimit, config.gasPrice),
  ); */

  // Execute the proposal
  const executeProposalMsg = { execute: { proposal_id: proposalId } };
  await client.execute(
    address,
    validatorVotingAddress,
    executeProposalMsg,
    calculateFee(config.gasLimit, config.gasPrice),
  );
}

main().then(
  () => {
    console.info("Arbiter Pool migrated!");
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
