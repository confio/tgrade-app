import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { OcContract } from "utils/oversightCommunity";
import { createSigningClient } from "utils/sdk";

import { selectMnemonicByNumber } from "../../../../cypress/fixtures/existingAccounts";

const mnemonic = selectMnemonicByNumber("adminAccount");
const comment = "Add new member";
const memberToAdd = makeRandomAddress();
const responseTimeout = 30000;

it(
  "creates OC proposal with Oversight Community member",
  async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];

    const OcCommunity = new OcContract(config, signingClient);

    const oC = await OcCommunity.propose(address, comment, {
      add_voting_members: {
        voters: [memberToAdd],
      },
    });

    expect(oC.proposalId).toBeTruthy();
    if (!oC.proposalId) return;

    const txHash = await OcCommunity.executeProposal(address, oC.proposalId);

    expect(txHash).toBeTruthy();
  },
  responseTimeout,
);

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
