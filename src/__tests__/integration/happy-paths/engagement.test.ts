import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { createSigningClient } from "utils/sdk";

import { PoEContractType } from "../../../codec/confio/poe/v1beta1/poe";
import { OcContract } from "../../../utils/oversightCommunity";
import { EngagementContract, EngagementContractQuerier } from "../../../utils/poeEngagement";

const mnemonic = process.env.SECRET_MNEMONIC || "";
const comment = "Comment message" + new Date();
const member = makeRandomAddress();

describe("Engagement", () => {
  it("Check engagement of an address", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];
    const egContract = new EngagementContractQuerier(config, PoEContractType.DISTRIBUTION, signingClient);
    const delegatedAddress = await egContract.getDelegated(address);
    expect(delegatedAddress).toBe(address);
  });

  it("Claim my own rewards", async () => {
    /**
     * execute a grant engagement proposal from the OC
     * wait some time for rewards to accumulate
     * the OC member account
     * TDB
     * */
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];

    const OcCommunity = new OcContract(config, signingClient);
    const oC = await OcCommunity.propose(address, comment, {
      grant_engagement: {
        member,
        points: parseInt("4", 10),
      },
    });

    if (!oC.proposalId) return;
    const txHash = await OcCommunity.executeProposal(address, oC.proposalId);
    expect(txHash).toBeTruthy();

    const egContract = new EngagementContract(config, PoEContractType.DISTRIBUTION, signingClient);

    const totalEngagementPoints = await egContract.getTotalEngagementPoints();
    expect(totalEngagementPoints).toBe(10000);

    //jest.setTimeout(30000);
    const withdrawRewards = await egContract.withdrawRewards(address);
    expect(withdrawRewards).toBe(10000);
  }, 25000);

  it.skip("Claim my own rewards and send them to another address", () => {
    //TODO
  });

  it.skip("Set another account as my delegate", () => {
    //TODO
  });

  it.skip("As a delegate, claim rewards from an account that has chosen me as delegate", () => {
    //TODO
  });

  it.skip("As a delegate, claim rewards from an account that has chosen me as delegate and send them to another address", () => {
    //TODO
  });
});

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
