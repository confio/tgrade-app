import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { createSigningClient, generateMnemonic } from "utils/sdk";
import { TcContract } from "utils/trustedCircle";

const tcName = "Trusted Circle #1";
const escrowAmount = "1000000";
const votingPeriod = "19";
const quorum = "30";
const threshold = "51";
const members_01: readonly string[] = [makeRandomAddress()];
const members_02: readonly string[] = [makeRandomAddress()];

const allowEndEarly = true;
const comment = "Comment message";

const mnemonic_01 = generateMnemonic();
const mnemonic_02 = generateMnemonic();

describe("Trusted Circle", () => {
  it("Add another voting member -> 2 members_01 can vote yes, no, abstain.", async () => {
    /**
     * For that we need to create and execute Add voting member proposal,
     * and then the member needs to deposit required escrow.
     * Then we should create proposals and test that the 2 members_01 can vote yes, no, abstain.
     */

    const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet_01);
    const { address } = (await wallet_01.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    const tcContractAddress = await TcContract.createTc(
      signingClient_01,
      config.codeIds?.tgradeDso?.[0] ?? 0,
      address,
      tcName,
      escrowAmount,
      votingPeriod,
      quorum,
      threshold,
      members_01,
      allowEndEarly,
      [
        {
          denom: config.feeToken,
          amount: escrowAmount,
        },
      ],
      config.gasPrice,
    );

    const tcContract = new TcContract(tcContractAddress, signingClient_01, config.gasPrice);
    const txHash = await tcContract.propose(address, comment, {
      add_voting_members: { voters: members_02 },
    });

    console.log(mnemonic_02);

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const createdProposal = await tcContract.getProposal(txHash.proposalId);

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(executedProposal.status).toBe("executed");

    /*const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_02, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_02 = await createSigningClient(config, wallet_02);
    const { address } = (await wallet_02.getAccounts())[0];
    console.log("wallet_02   " + address);

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    const transactionHash = await tcContract.depositEscrow(addressWalletUser_B, [
      { denom: config.feeToken, amount: "1000000" },
    ]);

    const txHash_02 = await tcContract.propose(address, comment, {
      add_voting_members: { voters: members_02 },
    });

    await tcContract.voteProposal(address, txHash.proposalId, "yes");*/
  }, 25000);

  afterEach(async () => {});
});

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
