import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { OcContract } from "utils/oversightCommunity";
import { createSigningClient, generateMnemonic } from "utils/sdk";

import { selectMnemonicByNumber } from "../../../../cypress/fixtures/existingAccounts";

const mnemonic = selectMnemonicByNumber("adminAccount");
const comment = "Add new member with random generated mnemonic";
const randomMnemonic = generateMnemonic();

it("creates OC proposal with Oversight Community member", async () => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  const wallet_member = await DirectSecp256k1HdWallet.fromMnemonic(randomMnemonic, {
    hdPaths: [makeCosmoshubPath(0)],
    prefix: config.addressPrefix,
  });

  console.log(randomMnemonic);

  await createSigningClient(config, wallet_member);
  const walletMemberAddress = (await wallet_member.getAccounts())[0].address;

  const signingClient = await createSigningClient(config, wallet);
  const { address } = (await wallet.getAccounts())[0];

  const OcCommunity = new OcContract(config, signingClient);

  const oC = await OcCommunity.propose(address, comment, {
    add_voting_members: {
      voters: [walletMemberAddress],
    },
  });

  expect(oC.proposalId).toBeTruthy();
  if (!oC.proposalId) return;

  const txHash = await OcCommunity.executeProposal(address, oC.proposalId);

  expect(txHash).toBeTruthy();
}, 20000);
