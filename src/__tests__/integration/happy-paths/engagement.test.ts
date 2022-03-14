import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
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
const member = makeRandomAddress();

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
     * send them to my own wallet
     * */
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address: userWallet } = (await wallet.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(userWallet, config.faucetTokens?.[0] ?? config.feeToken);

    const currentWalletBalance = await signingClient.getBalance(userWallet, config.feeToken);
    console.log(currentWalletBalance);
    expect(parseInt(currentWalletBalance.amount)).toBeGreaterThan(100000000000);

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
    expect(parseInt(withdrawableRewardsBefore.amount)).toBe(0);

    /*    const engagementPointsBefore = await egContract.getEngagementPoints(userWallet);
    expect(engagementPointsBefore).toBeGreaterThan(0);*/

    // Withdraw Rewards
    await egContract.withdrawRewards(userWallet);

    /*    // After Withdraw Rewards step
    const engagementPointsAfter = await egContract.getEngagementPoints(userWallet);
    // Why it is not failed here?
    expect(engagementPointsAfter).toBeGreaterThan(0);*/

    const withdrawableRewardsAfter = await egContract.getWithdrawableRewards(userWallet);
    expect(withdrawableRewardsAfter.denom).toBe("utgd");
    expect(withdrawableRewardsAfter.amount).toBe("0");

    const walletBalanceAfterWithdraw = await signingClient.getBalance(userWallet, config.feeToken);
    console.log(walletBalanceAfterWithdraw);
    expect(parseInt(walletBalanceAfterWithdraw.amount)).toBeGreaterThan(100000000000);
  }, 25000);

  it("Claim my own rewards and send them to another address", async () => {
    const mnemonic_02 = generateMnemonic();
    /**
     * execute a grant engagement proposal from the OC
     * use own wallet address as member
     * withdraw all Rewards to the same wallet address
     * send them to another address
     * */
    const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet_01);
    const { address: walletUserA } = (await wallet_01.getAccounts())[0];

    const faucetClient_01 = new FaucetClient(config.faucetUrl);
    await faucetClient_01.credit(walletUserA, config.faucetTokens?.[0] ?? config.feeToken);

    const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_02, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    await createSigningClient(config, wallet_02);
    const { address: walletUserB } = (await wallet_02.getAccounts())[0];

    /*    const faucetClient_02 = new FaucetClient(config.faucetUrl);
    await faucetClient_02.credit(walletUserB, config.faucetTokens?.[0] ?? config.feeToken);*/

    const OcCommunity = new OcContract(config, signingClient_01);
    const oC = await OcCommunity.propose(walletUserA, comment, {
      grant_engagement: {
        member: walletUserB,
        points: parseInt("1000", 10),
      },
    });

    if (!oC.proposalId) return;
    const txHash = await OcCommunity.executeProposal(walletUserA, oC.proposalId);
    expect(txHash).toBeTruthy();
    const egContract = new EngagementContract(config, PoEContractType.ENGAGEMENT, signingClient_01);

    // Before "Withdraw Rewards" step
    const withdrawableRewardsBefore = await egContract.getWithdrawableRewards(walletUserB);
    expect(parseInt(withdrawableRewardsBefore.amount)).toBe(0);

    const engagementPointsBefore = await egContract.getEngagementPoints(walletUserB);
    expect(engagementPointsBefore).toBeGreaterThan(0);

    // Withdraw Rewards
    await egContract.withdrawRewards(walletUserA, walletUserA, walletUserB);

    // After Withdraw Rewards step
    const engagementPointsAfter = await egContract.getEngagementPoints(walletUserB);
    expect(engagementPointsAfter).toBeGreaterThan(0);

    const withdrawableRewardsAfter = await egContract.getWithdrawableRewards(walletUserB);
    expect(withdrawableRewardsAfter.denom).toBe("utgd");
    expect(withdrawableRewardsAfter.amount).toBe("0");
  }, 25000);

  it("Set another account as my delegate", async () => {
    const mnemonic_02 = generateMnemonic();
    /**
     * execute a grant engagement proposal from the OC
     * use another member address wallet
     * withdraw all Rewards to the same wallet address
     * send them to another address
     * */
    const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet_01);
    const { address: walletUserA } = (await wallet_01.getAccounts())[0];

    const faucetClient_01 = new FaucetClient(config.faucetUrl);
    await faucetClient_01.credit(walletUserA, config.faucetTokens?.[0] ?? config.feeToken);

    const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_02, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_02 = await createSigningClient(config, wallet_02);
    const { address: walletUserB } = (await wallet_02.getAccounts())[0];

    const faucetClient_02 = new FaucetClient(config.faucetUrl);
    await faucetClient_02.credit(walletUserB, config.faucetTokens?.[0] ?? config.feeToken);

    const OcCommunity = new OcContract(config, signingClient_01);
    const oC = await OcCommunity.propose(walletUserA, comment, {
      grant_engagement: {
        member: walletUserB,
        points: parseInt("1000", 10),
      },
    });

    if (!oC.proposalId) return;
    const txHash = await OcCommunity.executeProposal(walletUserA, oC.proposalId);
    expect(txHash).toBeTruthy();
    const egContract = new EngagementContract(config, PoEContractType.ENGAGEMENT, signingClient_01);

    // Delegated withdrawal to wallet B
    await egContract.delegateWithdrawal(walletUserA, walletUserB);

    // assert amount before "Withdraw Rewards" step
    const withdrawableRewardsBefore = await egContract.getWithdrawableRewards(walletUserB);
    expect(parseInt(withdrawableRewardsBefore.amount)).toBe(0);

    const engagementPointsBefore = await egContract.getEngagementPoints(walletUserB);
    expect(engagementPointsBefore).toBeGreaterThan(0);

    const { amount: balance_utgd_before } = await signingClient_02.getBalance(walletUserB, config.feeToken);
    console.log(balance_utgd_before);

    // Withdraw Rewards
    await egContract.withdrawRewards(walletUserA, walletUserA, walletUserB);

    // After Withdraw Rewards step
    const { amount: balance_utgd } = await signingClient_02.getBalance(walletUserB, config.feeToken);
    console.log(balance_utgd);

    const engagementPointsAfterWalletA = await egContract.getEngagementPoints(walletUserA);
    expect(engagementPointsAfterWalletA).toBeGreaterThan(0);

    const withdrawableRewardsAfterWalletA = await egContract.getWithdrawableRewards(walletUserA);
    expect(withdrawableRewardsAfterWalletA.amount).toBe("0");

    const engagementPointsAfterWalletUserB = await egContract.getEngagementPoints(walletUserB);
    expect(engagementPointsAfterWalletUserB).toBeGreaterThan(0);

    const withdrawableRewardsAfterWalletB = await egContract.getWithdrawableRewards(walletUserB);
    expect(withdrawableRewardsAfterWalletB.amount).toBeGreaterThan(0);
  }, 25000);

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
