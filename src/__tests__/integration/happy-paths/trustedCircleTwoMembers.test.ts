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

console.log("MEMBER 01 " + members_01);
console.log("MEMBER 02 " + members_02);

const allowEndEarly = true;
const comment = "Comment message";

const mnemonic_01 = generateMnemonic();
const mnemonic_02 = generateMnemonic();

console.log("MNEMONIC 01 " + mnemonic_01);
console.log("MNEMONIC 02 " + mnemonic_02);

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

    const faucetClient_01 = new FaucetClient(config.faucetUrl);
    await faucetClient_01.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_02, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_02 = await createSigningClient(config, wallet_02);
    const { address: walletUserB } = (await wallet_02.getAccounts())[0];
    console.log("wallet_02   " + walletUserB);

    const faucetClient_02 = new FaucetClient(config.faucetUrl);
    await faucetClient_02.credit(walletUserB, config.faucetTokens?.[0] ?? config.feeToken);

    const tcContractAddress = await TcContract.createTc(
      signingClient_01,
      config.codeIds?.tgradeDso?.[0] ?? 0,
      address,
      tcName,
      escrowAmount,
      votingPeriod,
      quorum,
      threshold,
      [],
      allowEndEarly,
      [
        {
          denom: config.feeToken,
          amount: escrowAmount,
        },
      ],
      config.gasPrice,
    );

    console.log(tcContractAddress);

    const tcContract_01 = new TcContract(tcContractAddress, signingClient_01, config.gasPrice);
    const txHash = await tcContract_01.propose(address, comment, {
      add_voting_members: { voters: [walletUserB] },
    });

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const createdProposal = await tcContract_01.getProposal(txHash.proposalId);
    await tcContract_01.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract_01.getProposal(txHash.proposalId);
    expect(executedProposal.status).toBe("executed");

    const tcContract_02 = new TcContract(tcContractAddress, signingClient_02, config.gasPrice);
    const transactionHash = await tcContract_02.depositEscrow(walletUserB, [
      { denom: config.feeToken, amount: escrowAmount },
    ]);

    //await tcContract_01.voteProposal(address, txHash.proposalId, "yes");
  }, 35000);

  afterEach(async () => {});
});

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
