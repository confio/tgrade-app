#!/usr/bin/env node

/* eslint-disable @typescript-eslint/naming-convention */
const { Random } = require("@cosmjs/crypto");
const { Bech32 } = require("@cosmjs/encoding");
const { coins } = require("@cosmjs/launchpad");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { assertIsBroadcastTxSuccess, SigningStargateClient } = require("@cosmjs/stargate");

const rpcUrl = "http://localhost:26657";
const prefix = "wasm";
const faucet = {
  mnemonic: "now mesh clog card twin rather knee head fancy matrix sponsor pill",
  address0: "wasm1syn8janzh5t6rggtmlsuzs5w7qqfxqglvk5k0d",
};
const alice = "wasm14qemq0vw6y3gc3u3e0aty2e764u4gs5lndxgyk";

async function main() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(faucet.mnemonic, undefined, prefix);
  const client = await SigningStargateClient.connectWithSigner(rpcUrl, wallet);
  const amount = coins(226644, "ucosm");
  const memo = "Ensure chain has my pubkey";
  const sendResult = await client.sendTokens(faucet.address0, alice, amount, memo);
  assertIsBroadcastTxSuccess(sendResult);
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
