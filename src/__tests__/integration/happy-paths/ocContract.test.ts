import { createSigningClient } from "utils/sdk";
import { OcContract } from "../../../utils/oversightCommunity";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";

const mnemonic = process.env.SECRET_MNEMONIC || ""; // to run locally use real mnemonic instead
const addressPrefix = "tgrade";

it("creates OC proposal with Oversight Community member", async () => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: addressPrefix,
  });

  const signingClient = await createSigningClient(config, wallet);

  const { address } = (await wallet.getAccounts())[0];

  const comment = "Add new member";
  const memberToAdd = makeRandomAddress();

  const OcCommunity = new OcContract(config, signingClient);

  const oC = await OcCommunity.propose(address, comment, {
    add_voting_members: {
      voters: [memberToAdd],
    },
  });

  const txHash = await OcCommunity.executeProposal(address, oC.proposalId);

  expect(txHash).toBeTruthy();
}, 10000);

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
