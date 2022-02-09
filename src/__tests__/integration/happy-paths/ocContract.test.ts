import { config } from "config/network";
import { createSigningClient } from "utils/sdk";
import { OcContract } from "../../../utils/oversightCommunity";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";

const mnemonic = process.env.SECRET_MNEMONIC;

describe("create a signing client using the mnemonic", async () => {
  it("creates proposal for Add Oversight Community member", async () => {
    const addressPrefix = "tgrade";

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);

    const { address } = (await wallet.getAccounts())[0];

    const comment = "Add new member";
    const memberToAdd = "tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3";

    const OcCommunity = new OcContract(config, signingClient);

    await OcCommunity.propose(address, comment, {
      add_voting_members: {
        voters: [memberToAdd],
      },
    });

    const txHash = await OcCommunity.executeProposal(address, "tc1");

    expect(txHash).toBeTruthy();
  }, 10000);
});
