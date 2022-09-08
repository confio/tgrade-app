import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { createSigningClient, generateMnemonic, getCodeIds } from "utils/sdk";
import { TcContract } from "utils/trustedCircle";

const tcName = "Trusted Circle #1";
const escrowAmount = "1000000";
const votingPeriod = "19";
const quorum = "30";
const threshold = "51";
const member: readonly string[] = [makeRandomAddress()];

const allowEndEarly = true;
const comment = "New proposal";

const mnemonic_01 = generateMnemonic();
const mnemonic_02 = generateMnemonic();

const responseTimeout = 30000;

describe("Trusted Circle with two members", () => {
  it(
    "Vote - 'Yes' in proposal",
    async () => {
      /**
       * Two members sign in as @Client_01 and @Client_02
       * Create and execute proposal with 'Add voting member' using address of (@User_B) under Client_01
       * Add escrow for @User_B
       * Create second proposal under @Client_01 using @User_B wallet
       * Proposal has created with state 'Open'
       * Vote - 'Yes' in proposal using @User_B member
       */

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

      const codeIds = await getCodeIds(config, signingClient_01);

      const tcContractAddress = await TcContract.createTc(
        signingClient_01,
        codeIds.trustedCircle,
        walletUserA,
        tcName,
        escrowAmount,
        votingPeriod,
        quorum,
        threshold,
        member,
        allowEndEarly,
        [
          {
            denom: config.feeToken,
            amount: escrowAmount,
          },
        ],
        config.gasPrice,
      );

      const tcContract_01 = new TcContract(tcContractAddress, signingClient_01, config.gasPrice);
      const tcContract_02 = new TcContract(tcContractAddress, signingClient_02, config.gasPrice);

      const txHash = await tcContract_01.propose(walletUserA, comment, {
        add_voting_members: { voters: [walletUserB] },
      });

      if (!txHash.proposalId) return;
      await tcContract_01.getProposal(txHash.proposalId);
      await tcContract_01.executeProposal(walletUserA, txHash.proposalId);
      const executedProposal = await tcContract_01.getProposal(txHash.proposalId);
      expect(executedProposal.status).toBe("executed");

      await tcContract_02.depositEscrow(walletUserB, [{ denom: config.feeToken, amount: escrowAmount }]);

      const escrowResponse = await tcContract_02.getEscrow(walletUserB);
      expect(escrowResponse?.paid).toBe(escrowAmount);

      const txHashSecond = await tcContract_01.propose(walletUserA, comment, {
        add_voting_members: { voters: [walletUserB] },
      });

      if (!txHashSecond.proposalId) return;
      const proposalBefore = await tcContract_01.getProposal(txHashSecond.proposalId);
      expect(proposalBefore.votes.yes).toBe(1);
      expect(proposalBefore.status).toBe("open");

      await tcContract_02.voteProposal(walletUserB, txHashSecond.proposalId, "yes");
      const proposalAfter = await tcContract_01.getProposal(txHashSecond.proposalId);
      expect(proposalAfter.votes.yes).toBe(2);
      expect(proposalAfter.status).toBe("passed");
    },
    responseTimeout,
  );

  it(
    "Vote - 'No' in proposal",
    async () => {
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

      const codeIds = await getCodeIds(config, signingClient_01);

      const tcContractAddress = await TcContract.createTc(
        signingClient_01,
        codeIds.trustedCircle,
        walletUserA,
        tcName,
        escrowAmount,
        votingPeriod,
        quorum,
        threshold,
        member,
        allowEndEarly,
        [
          {
            denom: config.feeToken,
            amount: escrowAmount,
          },
        ],
        config.gasPrice,
      );

      const tcContract_01 = new TcContract(tcContractAddress, signingClient_01, config.gasPrice);
      const tcContract_02 = new TcContract(tcContractAddress, signingClient_02, config.gasPrice);

      const txHash = await tcContract_01.propose(walletUserA, comment, {
        add_voting_members: { voters: [walletUserB] },
      });

      if (!txHash.proposalId) return;
      await tcContract_01.getProposal(txHash.proposalId);
      await tcContract_01.executeProposal(walletUserA, txHash.proposalId);
      const executedProposal = await tcContract_01.getProposal(txHash.proposalId);
      expect(executedProposal.status).toBe("executed");

      await tcContract_02.depositEscrow(walletUserB, [{ denom: config.feeToken, amount: escrowAmount }]);

      const escrowResponse = await tcContract_02.getEscrow(walletUserB);
      expect(escrowResponse?.paid).toBe(escrowAmount);

      const txHashSecond = await tcContract_01.propose(walletUserA, comment, {
        add_voting_members: { voters: [walletUserB] },
      });

      if (!txHashSecond.proposalId) return;
      const proposalBefore = await tcContract_01.getProposal(txHashSecond.proposalId);
      expect(proposalBefore.votes.no).toBe(0);
      expect(proposalBefore.status).toBe("open");

      await tcContract_02.voteProposal(walletUserB, txHashSecond.proposalId, "no");
      const proposalAfter = await tcContract_01.getProposal(txHashSecond.proposalId);

      expect(proposalAfter.votes.no).toBe(1);
      expect(proposalAfter.status).toBe("open");
    },
    responseTimeout,
  );

  it(
    "Vote - 'abstain' in proposal",
    async () => {
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

      const codeIds = await getCodeIds(config, signingClient_01);

      const tcContractAddress = await TcContract.createTc(
        signingClient_01,
        codeIds.trustedCircle,
        walletUserA,
        tcName,
        escrowAmount,
        votingPeriod,
        quorum,
        threshold,
        member,
        allowEndEarly,
        [
          {
            denom: config.feeToken,
            amount: escrowAmount,
          },
        ],
        config.gasPrice,
      );

      const tcContract_01 = new TcContract(tcContractAddress, signingClient_01, config.gasPrice);
      const tcContract_02 = new TcContract(tcContractAddress, signingClient_02, config.gasPrice);

      const txHash = await tcContract_01.propose(walletUserA, comment, {
        add_voting_members: { voters: [walletUserB] },
      });

      if (!txHash.proposalId) return;
      await tcContract_01.getProposal(txHash.proposalId);
      await tcContract_01.executeProposal(walletUserA, txHash.proposalId);
      const executedProposal = await tcContract_01.getProposal(txHash.proposalId);
      expect(executedProposal.status).toBe("executed");

      await tcContract_02.depositEscrow(walletUserB, [{ denom: config.feeToken, amount: escrowAmount }]);

      const escrowResponse = await tcContract_02.getEscrow(walletUserB);
      expect(escrowResponse?.paid).toBe(escrowAmount);

      const txHashSecond = await tcContract_01.propose(walletUserA, comment, {
        add_voting_members: { voters: [walletUserB] },
      });

      if (!txHashSecond.proposalId) return;
      const proposalBefore = await tcContract_01.getProposal(txHashSecond.proposalId);
      expect(proposalBefore.votes.abstain).toBe(0);
      expect(proposalBefore.status).toBe("open");

      await tcContract_02.voteProposal(walletUserB, txHashSecond.proposalId, "abstain");
      const proposalAfter = await tcContract_01.getProposal(txHashSecond.proposalId);

      expect(proposalAfter.votes.abstain).toBe(1);
      expect(proposalAfter.status).toBe("passed");
    },
    responseTimeout,
  );
});

function makeRandomAddress(): string {
  return Bech32.encode(config.addressPrefix, Random.getBytes(20));
}
