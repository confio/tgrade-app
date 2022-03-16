import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { createSigningClient, generateMnemonic } from "utils/sdk";

import { PoEContractType } from "../../../codec/confio/poe/v1beta1/poe";
import { OcContract } from "../../../utils/oversightCommunity";
import { EngagementContract, EngagementContractQuerier } from "../../../utils/poeEngagement";

const mnemonic_01 = process.env.SECRET_MNEMONIC || "";
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

  it("Claim my own rewards and send them to another address", async () => {
    const mnemonic_02 = generateMnemonic();
    /**
     * execute a grant engagement proposal from the OC
     * withdraw all Rewards to the User_B wallet address
     * send them to another address
     * Check that balance Wallet
     * of User_B is equal zero before withdraw
     * of User_B is NOT equal zero after withdraw
     *
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

    // Before Withdraw Rewards step
    const walletBalanceBeforeWithdraw = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceBeforeWithdraw.amount)).toBe(0);

    const withdrawableRewardsBefore = await egContract.getWithdrawableRewards(walletUserB);
    expect(parseInt(withdrawableRewardsBefore.amount)).toBe(0);

    const engagementPointsBefore = await egContract.getEngagementPoints(walletUserB);
    expect(engagementPointsBefore).toBeGreaterThan(0);

    // Withdraw Rewards
    await egContract.withdrawRewards(walletUserA, walletUserA, walletUserB);

    // After Withdraw Rewards step
    const engagementPointsAfter = await egContract.getEngagementPoints(walletUserB);
    expect(engagementPointsAfter).toBe(engagementPointsBefore);

    const withdrawableRewardsAfter = await egContract.getWithdrawableRewards(walletUserB);
    expect(withdrawableRewardsAfter.amount).toBe("0");

    const walletBalanceAfterWithdraw = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceAfterWithdraw.amount)).toBeGreaterThan(0);
  }, 25000);

  it("Set another account as my delegate", async () => {
    const mnemonic_02 = generateMnemonic();
    /**
     * execute a grant engagement proposal from the OC
     * use own wallet address as member
     * withdraw all Rewards to the same wallet address
     * send them to another address
     * Check that balance Wallet
     * of User_B is equal zero before withdraw
     * of User_B is NOT equal zero after withdraw
     *
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

    const { address: walletUserB } = (await wallet_02.getAccounts())[0];
    const egContract = new EngagementContract(config, PoEContractType.ENGAGEMENT, signingClient_01);

    console.log(walletUserA);
    console.log(walletUserB);

    // set default delegated address
    await egContract.delegateWithdrawal(walletUserA, walletUserA);

    const delegatedAddressBefore = await egContract.getDelegated(walletUserA);
    expect(delegatedAddressBefore).toEqual(walletUserA);

    // set delegated Address of wallet User_B
    await egContract.delegateWithdrawal(walletUserA, walletUserB);

    const delegatedAddressAfter = await egContract.getDelegated(walletUserA);
    console.log(delegatedAddressAfter);
    expect(delegatedAddressAfter).toEqual(walletUserB);
  }, 25000);

  it("As a delegate, claim rewards from an account that has chosen me as delegate", async () => {
    const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet_01);
    const { address: walletUserA } = (await wallet_01.getAccounts())[0];

    const faucetClient_01 = new FaucetClient(config.faucetUrl);
    await faucetClient_01.credit(walletUserA, config.faucetTokens?.[0] ?? config.feeToken);

    const egContract = new EngagementContract(config, PoEContractType.ENGAGEMENT, signingClient_01);

    // set default delegated address
    await egContract.delegateWithdrawal(walletUserA, walletUserA);

    const delegatedAddressBefore = await egContract.getDelegated(walletUserA);
    expect(delegatedAddressBefore).toEqual(walletUserA);

    // Before Withdraw Rewards step
    const walletBalanceBeforeWithdraw = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceBeforeWithdraw.amount)).toBeGreaterThan(100000000000);

    const withdrawableRewardsBefore = await egContract.getWithdrawableRewards(walletUserA);
    expect(parseInt(withdrawableRewardsBefore.amount)).toBeGreaterThan(0);

    const engagementPointsBefore = await egContract.getEngagementPoints(walletUserA);
    expect(engagementPointsBefore).toBeGreaterThan(0);

    // Withdraw Rewards
    await egContract.withdrawRewards(walletUserA);

    // After Withdraw Rewards step
    const engagementPointsAfter = await egContract.getEngagementPoints(walletUserA);
    expect(engagementPointsAfter).toBe(engagementPointsBefore);

    const withdrawableRewardsAfter = await egContract.getWithdrawableRewards(walletUserA);
    expect(withdrawableRewardsAfter.amount).toBe("0");

    const walletBalanceAfterWithdraw = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceAfterWithdraw.amount)).toBeGreaterThan(
      parseInt(withdrawableRewardsBefore.amount),
    );
  }, 20000);

  it("As a delegate, claim rewards from an account that has chosen me as delegate and send them to another address", async () => {
    /**
     * we have owner, and 2 members
     * one of the member set as delegated
     * then we claim rewards to second member
     *
     * Assert wallet amount first member before
     * and after withdraw
     *
     * assert wallet amount second member before
     * and after withdraw
     * */

    const mnemonic_02 = generateMnemonic();
    const mnemonic_03 = generateMnemonic();

    const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet_01);
    const { address: walletUserA } = (await wallet_01.getAccounts())[0];

    const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_02, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    await createSigningClient(config, wallet_02);
    const { address: walletUserB } = (await wallet_02.getAccounts())[0];

    const faucetClient_02 = new FaucetClient(config.faucetUrl);
    await faucetClient_02.credit(walletUserB, config.faucetTokens?.[0] ?? config.feeToken);

    const wallet_03 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_03, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_03 = await createSigningClient(config, wallet_03);
    const { address: walletUserC } = (await wallet_03.getAccounts())[0];

    const egContract = new EngagementContract(config, PoEContractType.ENGAGEMENT, signingClient_01);

    // set default delegated address
    await egContract.delegateWithdrawal(walletUserA, walletUserB);

    const delegatedAddressBefore = await egContract.getDelegated(walletUserA);
    expect(delegatedAddressBefore).toEqual(walletUserB);

    // change delegated address to User_C wallet
    await egContract.delegateWithdrawal(walletUserB, walletUserC);

    // Before Withdraw Rewards step
    const walletBalanceBeforeWithdraw = await signingClient_03.getBalance(walletUserC, config.feeToken);
    expect(parseInt(walletBalanceBeforeWithdraw.amount)).toBe(0);

    const withdrawableRewardsBefore = await egContract.getWithdrawableRewards(walletUserC);
    expect(parseInt(withdrawableRewardsBefore.amount)).toBe(0);

    const engagementPointsBefore = await egContract.getEngagementPoints(walletUserC);
    expect(engagementPointsBefore).toBe(0);

    // Withdraw Rewards
    await egContract.withdrawRewards(walletUserB, walletUserB, walletUserC);

    // After Withdraw Rewards step
    const engagementPointsAfter = await egContract.getEngagementPoints(walletUserC);
    expect(engagementPointsAfter).toBe(engagementPointsBefore);

    const withdrawableRewardsAfter = await egContract.getWithdrawableRewards(walletUserC);
    expect(withdrawableRewardsAfter.amount).toBe("0");

    const walletBalanceAfterWithdraw = await signingClient_03.getBalance(walletUserC, config.feeToken);
    expect(parseInt(walletBalanceAfterWithdraw.amount)).toBeGreaterThan(
      parseInt(withdrawableRewardsBefore.amount),
    );
  }, 20000);
});
