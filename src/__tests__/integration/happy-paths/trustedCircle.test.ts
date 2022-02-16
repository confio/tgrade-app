import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { createSigningClient, generateMnemonic } from "utils/sdk";
import { TcContract, TcContractQuerier } from "utils/trustedCircle";

const tcName = "Trusted Circle #1";
const escrowAmount = "1000000";
const votingPeriod = "19";
const quorum = "30";
const threshold = "51";
const members: readonly string[] = [makeRandomAddress()];
const allowEndEarly = true;
const comment = "Comment message";

const mnemonic = generateMnemonic();

describe("Trusted Circle", () => {
  it("Create a Trusted circle", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    const tcContractAddress = await TcContract.createTc(
      signingClient,
      config.codeIds?.tgradeDso?.[0] ?? 0,
      address,
      tcName,
      escrowAmount,
      votingPeriod,
      quorum,
      threshold,
      members,
      allowEndEarly,
      [
        {
          denom: config.feeToken,
          amount: escrowAmount,
        },
      ],
      config.gasPrice,
    );

    const tcContract = new TcContractQuerier(tcContractAddress, signingClient);
    const tcResponse = await tcContract.getTc();

    expect(tcResponse.escrow_amount).toBe(escrowAmount);
    expect(tcResponse.escrow_pending).toBeNull();
    expect(tcResponse.rules.voting_period.toString()).toBe(votingPeriod);
    expect(tcResponse.rules.quorum).toBe("0.3");
    expect(tcResponse.rules.threshold).toBe("0.51");
    expect(tcResponse.rules.allow_end_early).toBe(allowEndEarly);
    expect(tcContractAddress.startsWith(config.addressPrefix)).toBeTruthy();
  });

  it("Create and execute TC proposal for adding voting members", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    const tcContractAddress = await TcContract.createTc(
      signingClient,
      config.codeIds?.tgradeDso?.[0] ?? 0,
      address,
      tcName,
      escrowAmount,
      votingPeriod,
      quorum,
      threshold,
      members,
      allowEndEarly,
      [
        {
          denom: config.feeToken,
          amount: escrowAmount,
        },
      ],
      config.gasPrice,
    );

    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);
    const txHash = await tcContract.propose(address, comment, {
      add_voting_members: { voters: members },
    });

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const getCreatedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(getCreatedProposal.proposal.add_voting_members?.voters[0]).toContain(config.addressPrefix);

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(executedProposal.status).toBe("executed");
  }, 30000);

  it("Create and execute TC proposal for adding non voting members", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    const tcContractAddress = await TcContract.createTc(
      signingClient,
      config.codeIds?.tgradeDso?.[0] ?? 0,
      address,
      tcName,
      escrowAmount,
      votingPeriod,
      quorum,
      threshold,
      members,
      allowEndEarly,
      [
        {
          denom: config.feeToken,
          amount: escrowAmount,
        },
      ],
      config.gasPrice,
    );

    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);
    const txHash = await tcContract.propose(address, comment, {
      add_remove_non_voting_members: { remove: [], add: [makeRandomAddress()] },
    });

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const createdProposal = await tcContract.getProposal(txHash.proposalId);

    expect(createdProposal.proposal.add_remove_non_voting_members).toBeTruthy();
    expect(createdProposal.proposal.add_remove_non_voting_members?.add[0]).toContain(config.addressPrefix);
    expect(createdProposal.proposal.add_remove_non_voting_members?.remove.length).toBe(0);

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(executedProposal.status).toBe("executed");
  }, 30000);

  it("Create and execute TC proposal for editing trusted circle", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    const tcContractAddress = await TcContract.createTc(
      signingClient,
      config.codeIds?.tgradeDso?.[0] ?? 0,
      address,
      tcName,
      escrowAmount,
      votingPeriod,
      quorum,
      threshold,
      members,
      allowEndEarly,
      [
        {
          denom: config.feeToken,
          amount: escrowAmount,
        },
      ],
      config.gasPrice,
    );

    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);
    const txHash = await tcContract.propose(address, comment, {
      edit_trusted_circle: {
        name: "new name for the Trusted Circle",
        escrow_amount: null,
        voting_period: 14,
        quorum: "0.5",
        threshold: "1.0",
        allow_end_early: true,
      },
    });

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const createdProposal = await tcContract.getProposal(txHash.proposalId);

    expect(createdProposal.proposal.edit_trusted_circle).toBeTruthy();
    expect(createdProposal.proposal.edit_trusted_circle?.name).toContain("Trusted Circle");

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);

    expect(executedProposal.status).toBe("executed");
  }, 30000);

  it("Create and execute TC proposal for removing non voting participants", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    const tcContractAddress = await TcContract.createTc(
      signingClient,
      config.codeIds?.tgradeDso?.[0] ?? 0,
      address,
      tcName,
      escrowAmount,
      votingPeriod,
      quorum,
      threshold,
      members,
      allowEndEarly,
      [
        {
          denom: config.feeToken,
          amount: escrowAmount,
        },
      ],
      config.gasPrice,
    );

    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);

    // Add non_voting_members
    const addMemberAddress = await tcContract.propose(address, comment, {
      add_remove_non_voting_members: { remove: [], add: [makeRandomAddress()] },
    });

    expect(addMemberAddress.proposalId).toBeTruthy();
    if (!addMemberAddress.proposalId) return;

    const createdFirstProposal = await tcContract.getProposal(addMemberAddress.proposalId);
    expect(createdFirstProposal.title).toContain("Add participants");
    expect(createdFirstProposal.status).toContain("passed");
    expect(createdFirstProposal.proposal.add_remove_non_voting_members?.add[0]).toContain(
      config.addressPrefix,
    );
    expect(createdFirstProposal.proposal.add_remove_non_voting_members?.remove.length).toBe(0);

    // Remove non_voting_members
    const removeMemberAddress = await tcContract.propose(address, comment, {
      add_remove_non_voting_members: { remove: [addMemberAddress.txHash], add: [] },
    });

    expect(removeMemberAddress.proposalId).toBeTruthy();
    if (!removeMemberAddress.proposalId) return;

    const createdSecondProposal = await tcContract.getProposal(removeMemberAddress.proposalId);
    expect(createdSecondProposal.title).toContain("Remove participants");
    expect(createdSecondProposal.status).toContain("passed");
    expect(createdSecondProposal.proposal.add_remove_non_voting_members?.add.length).toBe(0);
    expect(createdSecondProposal.proposal.add_remove_non_voting_members?.remove.length).not.toBe(0);

    const executedProposal = await tcContract.getProposal(2);
    expect(executedProposal.status).toBe("passed");
  }, 30000);

  xit("Create and execute TC proposal for punishing voting participant", () => {
    //TODO
  });

  xit("Create and execute TC proposal for whitelist pair", () => {
    //TODO
  });

  xit("Add another voting member", () => {
    //TODO
    /**
     * For that we need to create and execute Add voting member proposal,
     * and then the member needs to deposit required escrow.
     * Then we should create proposals and test that the 2 members can vote yes, no, abstain.
     */
  });
});

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
