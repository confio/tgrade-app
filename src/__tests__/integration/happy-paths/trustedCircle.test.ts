import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { FaucetClient } from "@cosmjs/faucet-client";
import { Decimal, Uint64 } from "@cosmjs/math";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { Contract20WS } from "utils/cw20";
import { Factory } from "utils/factory";
import { createSigningClient, generateMnemonic } from "utils/sdk";
import { SwapFormValues } from "utils/tokens";
import { Punishment, TcContract, TcContractQuerier } from "utils/trustedCircle";

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
  }, 15000);

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

    const createdProposal = await tcContract.getProposal(txHash.proposalId);
    expect(createdProposal.proposal.add_voting_members?.voters[0]).toContain(config.addressPrefix);

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

    // Create TC and add non voting member
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

    // Remove non_voting_members
    const removeMemberAddress = await tcContract.propose(address, comment, {
      add_remove_non_voting_members: { remove: [members[0]], add: [] },
    });

    expect(removeMemberAddress.proposalId).toBeTruthy();
    if (!removeMemberAddress.proposalId) return;

    const createdSecondProposal = await tcContract.getProposal(removeMemberAddress.proposalId);
    expect(createdSecondProposal.title).toContain("Remove participants");
    expect(createdSecondProposal.status).toContain("passed");
    expect(createdSecondProposal.proposal.add_remove_non_voting_members?.remove[0]).toContain(members[0]);
    expect(createdSecondProposal.proposal.add_remove_non_voting_members?.add.length).toBe(0);

    await tcContract.executeProposal(address, removeMemberAddress.proposalId);
    const executedProposal = await tcContract.getProposal(removeMemberAddress.proposalId);
    expect(executedProposal.status).toBe("executed");
  }, 30000);

  it("Create and execute TC proposal for punishing voting participant (burn_escrow)", async () => {
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

    const punishment: Punishment = {
      burn_escrow: {
        member: address,
        slashing_percentage: "1",
        kick_out: true,
      },
    };

    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);
    const txHash = await tcContract.propose(address, comment, {
      punish_members: [punishment],
    });

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const createdProposal = await tcContract.getProposal(txHash.proposalId);

    expect(createdProposal.status).toContain("passed");
    expect(createdProposal.proposal.punish_members?.[0].burn_escrow?.member).toBe(address);
    expect(createdProposal.proposal.punish_members?.[0].burn_escrow?.slashing_percentage).toBe("1");
    expect(createdProposal.proposal.punish_members?.[0].burn_escrow?.kick_out).toBe(true);

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(executedProposal.title).toBe("Punish voting participant");
    expect(executedProposal.status).toBe("executed");
  }, 15000);

  it("Create and execute TC proposal for punishing voting participant (distribute_escrow)", async () => {
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

    const punishment: Punishment = {
      distribute_escrow: {
        distribution_list: [members[0]],
        member: address,
        slashing_percentage: "1",
        kick_out: true,
      },
    };

    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);
    const txHash = await tcContract.propose(address, comment, {
      punish_members: [punishment],
    });
    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const createdProposal = await tcContract.getProposal(txHash.proposalId);

    expect(createdProposal.status).toContain("passed");
    expect(createdProposal.proposal.punish_members?.[0].burn_escrow?.member).toBe(address);
    expect(createdProposal.proposal.punish_members?.[0].burn_escrow?.slashing_percentage).toBe("1");
    expect(createdProposal.proposal.punish_members?.[0].burn_escrow?.kick_out).toBe(true);

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(executedProposal.title).toBe("Punish voting participant");
    expect(executedProposal.status).toBe("executed");
  }, 15000);

  it("Create and execute TC proposal for punishing voting participant (distribute_escrow)", async () => {
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

    const punishment: Punishment = {
      distribute_escrow: {
        distribution_list: [members[0]],
        member: address,
        slashing_percentage: "1",
        kick_out: true,
      },
    };

    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);
    const txHash = await tcContract.propose(address, comment, {
      punish_members: [punishment],
    });

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const createdProposal = await tcContract.getProposal(txHash.proposalId);

    expect(createdProposal.status).toContain("passed");
    expect(createdProposal.proposal.punish_members?.[0].distribute_escrow?.member).toBe(address);
    expect(createdProposal.proposal.punish_members?.[0].distribute_escrow?.slashing_percentage).toBe("1");
    expect(createdProposal.proposal.punish_members?.[0].distribute_escrow?.distribution_list[0]).toBe(
      members[0],
    );
    expect(createdProposal.proposal.punish_members?.[0].distribute_escrow?.kick_out).toBe(true);

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(executedProposal.title).toBe("Punish voting participant");
    expect(executedProposal.status).toBe("executed");
  }, 15000);

  it("Create and execute TC proposal for whitelist pair", async () => {
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

    // Create token
    const tokenSymbol = "TST";
    const tokenName = "Test Token";
    const tokenDecimals = 6;
    const tokenInitialSupply = "100000000";

    const codeId = config.codeIds?.cw20Tokens?.[0] ?? 0;

    const amount = Decimal.fromUserInput(tokenInitialSupply, tokenDecimals)
      .multiply(Uint64.fromNumber(10 ** tokenDecimals))
      .toString();

    // Creat contract with trusted token
    const tcTokenAddress = await Contract20WS.createContract(
      signingClient,
      codeId,
      address,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      [
        {
          address,
          amount,
        },
      ],
      undefined,
      undefined,
      tcContractAddress,
    );

    const tokens = await Contract20WS.getAll(config, signingClient, address);
    const tcTokenInfo = tokens[tcTokenAddress];
    const { amount: balance_utgd } = await signingClient.getBalance(address, config.feeToken);

    const tgradeToken = {
      address: config.feeToken,
      balance: balance_utgd,
      humanBalance: Decimal.fromAtomics(balance_utgd, config.coinMap.utgd.fractionalDigits).toString(),
      decimals: config.coinMap.utgd.fractionalDigits,
      name: "Tgrade",
      symbol: config.coinMap.utgd.denom,
      total_supply: "",
    };

    // Create pair
    const createPairValues: SwapFormValues = {
      From: 1.0,
      To: 10.0,
      selectFrom: tgradeToken,
      selectTo: tcTokenInfo,
    };

    await Factory.createPair(
      signingClient,
      address,
      config.factoryAddress,
      createPairValues,
      config.gasPrice,
    );
    const pairs = await Factory.getPairs(signingClient, config.factoryAddress);
    expect(pairs).toBeTruthy();

    // Whitelist pair on Trusted Circle
    const comment = "Whitelist tgd-tst";
    const pair = pairs[`${tgradeToken.address}-${tcTokenInfo.address}`];
    const pairAddress = pair.contract_addr;

    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);
    const txHash = await tcContract.propose(address, comment, { whitelist_contract: pairAddress });

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const tcContractQuerier = new TcContractQuerier(tcContractAddress, signingClient);
    const createdProposal = await tcContractQuerier.getProposal(txHash.proposalId);
    expect(createdProposal.title).toBe("Whitelist pair");
    expect(createdProposal.status).toBe("passed");
    expect(createdProposal.proposal.whitelist_contract).toContain(config.addressPrefix);

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(executedProposal.description).toBe("Whitelist tgd-tst");
    expect(executedProposal.status).toBe("executed");
  }, 20000);

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const createdProposal = await tcContract.getProposal(txHash.proposalId);

    expect(createdProposal.status).toContain("passed");
    expect(createdProposal.proposal.punish_members?.[0].distribute_escrow?.member).toBe(address);
    expect(createdProposal.proposal.punish_members?.[0].distribute_escrow?.slashing_percentage).toBe("1");
    expect(createdProposal.proposal.punish_members?.[0].distribute_escrow?.distribution_list[0]).toBe(
      members[0],
    );
    expect(createdProposal.proposal.punish_members?.[0].distribute_escrow?.kick_out).toBe(true);

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(executedProposal.title).toBe("Punish voting participant");
    expect(executedProposal.status).toBe("executed");
  }, 15000);

  it("Create and execute TC proposal for whitelist pair", async () => {
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

    // Create token
    const tokenSymbol = "TST";
    const tokenName = "Test Token";
    const tokenDecimals = 6;
    const tokenInitialSupply = "100000000";

    const codeId = config.codeIds?.cw20Tokens?.[0] ?? 0;

    const amount = Decimal.fromUserInput(tokenInitialSupply, tokenDecimals)
      .multiply(Uint64.fromNumber(10 ** tokenDecimals))
      .toString();

    // Creat contract with trusted token
    const tcTokenAddress = await Contract20WS.createContract(
      signingClient,
      codeId,
      address,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      [
        {
          address,
          amount,
        },
      ],
      undefined,
      undefined,
      tcContractAddress,
    );

    const tokens = await Contract20WS.getAll(config, signingClient, address);
    const tcTokenInfo = tokens[tcTokenAddress];
    const { amount: balance_utgd } = await signingClient.getBalance(address, config.feeToken);

    const tgradeToken = {
      address: config.feeToken,
      balance: balance_utgd,
      humanBalance: Decimal.fromAtomics(balance_utgd, config.coinMap.utgd.fractionalDigits).toString(),
      decimals: config.coinMap.utgd.fractionalDigits,
      name: "Tgrade",
      symbol: config.coinMap.utgd.denom,
      total_supply: "",
    };

    // Create pair
    const createPairValues: SwapFormValues = {
      From: 1.0,
      To: 10.0,
      selectFrom: tgradeToken,
      selectTo: tcTokenInfo,
    };

    await Factory.createPair(
      signingClient,
      address,
      config.factoryAddress,
      createPairValues,
      config.gasPrice,
    );
    const pairs = await Factory.getPairs(signingClient, config.factoryAddress);
    expect(pairs).toBeTruthy();

    // Whitelist pair on Trusted Circle
    const comment = "Whitelist tgd-tst";
    const pair = pairs[`${tgradeToken.address}-${tcTokenInfo.address}`];
    const pairAddress = pair.contract_addr;

    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);
    const txHash = await tcContract.propose(address, comment, { whitelist_contract: pairAddress });

    expect(txHash.proposalId).toBeTruthy();
    if (!txHash.proposalId) return;

    const tcContractQuerier = new TcContractQuerier(tcContractAddress, signingClient);
    const createdProposal = await tcContractQuerier.getProposal(txHash.proposalId);
    expect(createdProposal.title).toBe("Whitelist pair");
    expect(createdProposal.status).toBe("passed");
    expect(createdProposal.proposal.whitelist_contract).toContain(config.addressPrefix);

    await tcContract.executeProposal(address, txHash.proposalId);
    const executedProposal = await tcContract.getProposal(txHash.proposalId);
    expect(executedProposal.description).toBe("Whitelist tgd-tst");
    expect(executedProposal.status).toBe("executed");
  }, 20000);
});

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
