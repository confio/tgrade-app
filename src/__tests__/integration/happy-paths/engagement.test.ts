import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { createSigningClient, generateMnemonic } from "utils/sdk";

import { PoEContractType } from "../../../codec/confio/poe/v1beta1/poe";
import { OcContract } from "../../../utils/oversightCommunity";
import { EngagementContract, EngagementContractQuerier } from "../../../utils/poeEngagement";

//const mnemonic_01 = process.env.SECRET_MNEMONIC || "";
const mnemonic_01 = "bone idea foster kid item private figure victory power reflect wrong bunker";
const comment = "Comment message" + new Date();

describe("Engagement", () => {
  it("Check engagement of an address", async () => {
    /**
     * Check "Engagement points" until "Grand Engagement" proposal is not created
     * */
    const mnemonic = generateMnemonic();
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });
    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];

    const egContract = new EngagementContractQuerier(config, PoEContractType.ENGAGEMENT, signingClient);

    const engagementPoints = await egContract.getEngagementPoints(address);
    expect(engagementPoints).toBe(0);

    const withdrawableRewards = await egContract.getWithdrawableRewards(address);
    expect(withdrawableRewards.denom).toBe("utgd");
    expect(withdrawableRewards.amount).toBe("0");

    const currentWalletBalance = await signingClient.getBalance(address, config.feeToken);
    expect(currentWalletBalance.amount).toBe("0");
  });

  it("Claim my own rewards and pay them out to my own wallet ", async () => {
    /**
     * Create grant engagement proposal from the OC
     * use own wallet address as member
     * withdraw all Rewards to the same wallet address
     * assert EngagementPoints, wallet Balance, WithdrawableRewards
     * */
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address: userWallet } = (await wallet.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(userWallet, config.faucetTokens?.[0] ?? config.feeToken);

    const walletBalanceBeforeWithdraw = await signingClient.getBalance(userWallet, config.feeToken);
    expect(parseInt(walletBalanceBeforeWithdraw.amount)).toBeGreaterThan(100000000000);

    const OcCommunity = new OcContract(config, signingClient);
    const oC = await OcCommunity.propose(userWallet, comment, {
      grant_engagement: {
        member: userWallet,
        points: parseInt("1000", 10),
      },
    });

    if (!oC.proposalId) return;
    const txHash = await OcCommunity.executeProposal(userWallet, oC.proposalId);
    expect(txHash).toBeTruthy();
    const egContract = new EngagementContract(config, PoEContractType.ENGAGEMENT, signingClient);

    // Before Withdraw Rewards step
    const withdrawableRewardsBefore = await egContract.getWithdrawableRewards(userWallet);
    expect(parseInt(withdrawableRewardsBefore.amount)).toBeGreaterThan(0);

    const engagementPointsBefore = await egContract.getEngagementPoints(userWallet);
    expect(engagementPointsBefore).toBeGreaterThan(0);

    // Withdraw Rewards
    await egContract.withdrawRewards(userWallet);

    // After Withdraw Rewards step
    const engagementPointsAfter = await egContract.getEngagementPoints(userWallet);
    expect(engagementPointsAfter).toBe(engagementPointsBefore);

    const withdrawableRewardsAfter = await egContract.getWithdrawableRewards(userWallet);
    expect(withdrawableRewardsAfter.amount).toBe("0");

    const walletBalanceAfterWithdraw = await signingClient.getBalance(userWallet, config.feeToken);
    expect(parseInt(walletBalanceAfterWithdraw.amount)).toBeGreaterThan(
      parseInt(walletBalanceBeforeWithdraw.amount),
    );
  }, 25000);

  xit("Claim my own rewards and send them to another address", () => {
    // TODO
  });

  xit("Set another account as my delegate", () => {
    // TODO
  });

  xit("As a delegate, claim rewards from an account that has chosen me as delegate", () => {
    // TODO
  });

  xit("As a delegate, claim rewards from an account that has chosen me as delegate and send them to another address", () => {
    // TODO
  });
});
