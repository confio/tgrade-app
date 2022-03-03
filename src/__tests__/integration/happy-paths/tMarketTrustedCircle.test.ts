import { FaucetClient } from "@cosmjs/faucet-client";
import { Decimal, Uint64 } from "@cosmjs/math";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { Contract20WS } from "utils/cw20";
import { Factory } from "utils/factory";
import { createSigningClient, generateMnemonic, loadOrCreateWallet } from "utils/sdk";
import { Pool, ProvideFormValues, SwapFormValues, Token, WithdrawFormValues } from "utils/tokens";
import { TcContract } from "utils/trustedCircle";

const tcName = "Trusted Circle #1";
const escrowAmount = "1000000";
const votingPeriod = "19";
const quorum = "30";
const threshold = "51";
const allowEndEarly = true;

const mnemonic = generateMnemonic();

describe("T-Market with Trusted Circle", () => {
  it("pass with 'Provide Liquidity' and executed 'Whitelist pair' proposal", async () => {
    /**
     * Sign in as @Client with faucet
     * Create Trusted Circle
     * -------------//----------
     * Create token 'T-Market'
     * Create Asset(Contract) with trusted token
     * Get pair tgradeToken & cw20token
     * Add proposal with 'Whitelist pair' on Trusted Circle and execute it
     * Provide liquidity --> Check that this succeeds because we have whitelisted
     * */
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });
    const signingClient = await createSigningClient(config, wallet);
    const address = (await wallet.getAccounts())[0].address;
    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    // Create Trusted Circle
    const tcContractAddress = await TcContract.createTc(
      signingClient,
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

    // Create token
    const tokenSymbol = "BAL";
    const tokenName = "Balancer";
    const tokenDecimals = 6;
    const tokenInitialSupply = "100000000";

    const codeId = config.codeIds?.cw20Tokens?.[0] ?? 0;

    const amount = Decimal.fromUserInput(tokenInitialSupply, tokenDecimals)
      .multiply(Uint64.fromNumber(10 ** tokenDecimals))
      .toString();

    const tcTokenAddress = await Contract20WS.createContract(
      signingClient,
      codeId,
      address,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      [{ address, amount }],
      undefined,
      undefined,
      tcContractAddress,
    );
    expect(tcTokenAddress.startsWith(config.addressPrefix)).toBeTruthy();

    const tokens = await Contract20WS.getAll(config, signingClient, address);
    const cw20tokenInfo = tokens[tcTokenAddress];

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
      selectTo: cw20tokenInfo,
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

    // Provide liquidity
    const provideValues: ProvideFormValues = {
      assetA: 1.0,
      assetB: 10.0,
      selectFrom: tgradeToken,
      selectTo: cw20tokenInfo,
    };

    const pair = pairs[`${tgradeToken.address}-${cw20tokenInfo.address}`];
    const pairAddress = pair.contract_addr;

    await Contract20WS.Authorized(signingClient, cw20tokenInfo.address, address, pairAddress);
    const provideStatus = await Pool.ProvideLiquidity(
      signingClient,
      pairAddress,
      address,
      provideValues,
      config.gasPrice,
    );
    expect(provideStatus).toBeTruthy();

    // Whitelist pair on Trusted Circle
    const comment = "Whitelist Pair -> TGN-BAL";
    const tcContract = new TcContract(tcContractAddress, signingClient, config.gasPrice);
    const createdProposalHash = await tcContract.propose(address, comment, {
      whitelist_contract: pairAddress,
    });
    if (!createdProposalHash.proposalId) return;
    const txHash = await tcContract.executeProposal(address, createdProposalHash.proposalId);
    expect(txHash).toBeTruthy();
  }, 30000);

  it("should fail to pair with a proposal of the Trusted Circle", async () => {
    /**
     * Sign in as @Client with faucet
     * Create Trusted Circle
     * -------------//----------
     * Create token 'T-Market'
     * Create Asset(Contract) with trusted token
     * Get pair tgradeToken & cw20token
     * Provide liquidity --> Check that this fails because we have not whitelisted yet
     * */
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });
    const signingClient = await createSigningClient(config, wallet);
    const address = (await wallet.getAccounts())[0].address;
    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    // Create Trusted Circle
    const tcContractAddress = await TcContract.createTc(
      signingClient,
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

    // Create token T-Market
    const tokenSymbol = "ALPHA";
    const tokenName = "Alpha Finance";
    const tokenDecimals = 6;
    const tokenInitialSupply = "100000000";

    const codeId = config.codeIds?.cw20Tokens?.[0] ?? 0;

    const amount = Decimal.fromUserInput(tokenInitialSupply, tokenDecimals)
      .multiply(Uint64.fromNumber(10 ** tokenDecimals))
      .toString();

    // Create digital Asset
    const tcTokenAddress = await Contract20WS.createContract(
      signingClient,
      codeId,
      address,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      [{ address, amount }],
      undefined,
      undefined,
      tcContractAddress,
    );
    expect(tcTokenAddress.startsWith(config.addressPrefix)).toBeTruthy();

    const tokens = await Contract20WS.getAll(config, signingClient, address);
    const cw20tokenInfo = tokens[tcTokenAddress];

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

    // Create pair ALPHA <-> TGN
    const createPairValues: SwapFormValues = {
      From: 1.0,
      To: 10.0,
      selectFrom: tgradeToken,
      selectTo: cw20tokenInfo,
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

    // Provide liquidity
    const provideValues: ProvideFormValues = {
      assetA: 1.0,
      assetB: 10.0,
      selectFrom: tgradeToken,
      selectTo: cw20tokenInfo,
    };

    const pair = pairs[`${tgradeToken.address}-${cw20tokenInfo.address}`];
    const pairAddress = pair.contract_addr;

    await Contract20WS.Authorized(signingClient, cw20tokenInfo.address, address, pairAddress);
    const provideStatus = await Pool.ProvideLiquidity(
      signingClient,
      pairAddress,
      address,
      provideValues,
      config.gasPrice,
    );
    expect(provideStatus).toBeTruthy();
  }, 25000);

  it("creates a TC token, swaps it with TGD, withdraws liquidity", async () => {
    const signer = await loadOrCreateWallet(config);
    const signingClient = await createSigningClient(config, signer);
    const address = (await signer.getAccounts())[0].address;
    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    // Create Trusted Circle
    const dsoName = "Trusted Circle 1";
    const escrowAmount = "1000000";
    const votingDuration = "19";
    const quorum = "30";
    const threshold = "51";
    const members: readonly string[] = ["tgrade1uuy629yfuw2mf383t33x0jk2qwtf6rvv4dhmxs"];
    const allowEndEarly = true;

    const dsoAddress = await TcContract.createTc(
      signingClient,
      config.codeIds?.tgradeDso?.[0] ?? 0,
      address,
      dsoName,
      escrowAmount,
      votingDuration,
      quorum,
      threshold,
      members,
      allowEndEarly,
      [{ denom: config.feeToken, amount: escrowAmount }],
      config.gasPrice,
    );
    expect(dsoAddress.startsWith(config.addressPrefix)).toBeTruthy();

    // Create token
    const tokenSymbol = "TST";
    const tokenName = "Test Token";
    const tokenDecimals = 6;
    const tokenInitialSupply = "100000000";

    const codeId = config.codeIds?.tgradeCw20?.[0] ?? 0;

    const amount = Decimal.fromUserInput(tokenInitialSupply, tokenDecimals)
      .multiply(Uint64.fromNumber(10 ** tokenDecimals))
      .toString();

    const cw20tokenAddress = await Contract20WS.createContract(
      signingClient,
      codeId,
      address,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      [{ address, amount }],
      undefined,
      undefined,
      dsoAddress,
    );
    expect(cw20tokenAddress.startsWith(config.addressPrefix)).toBeTruthy();

    const tokens = await Contract20WS.getAll(config, signingClient, address);
    const cw20tokenInfo = tokens[cw20tokenAddress];

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
      selectTo: cw20tokenInfo,
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
    const pair = pairs[`${tgradeToken.address}-${cw20tokenInfo.address}`];
    const pairAddress = pair.contract_addr;

    const dsoContract = new TcContract(dsoAddress, signingClient, config.gasPrice);
    await dsoContract.propose(address, comment, { whitelist_contract: pairAddress });

    const txHash = await dsoContract.executeProposal(address, 1);
    expect(txHash).toBeTruthy();

    // Provide liquidity
    const provideValues: ProvideFormValues = {
      assetA: 1.0,
      assetB: 10.0,
      selectFrom: tgradeToken,
      selectTo: cw20tokenInfo,
    };

    await Contract20WS.Authorized(signingClient, cw20tokenInfo.address, address, pairAddress);
    const provideStatus = await Pool.ProvideLiquidity(
      signingClient,
      pairAddress,
      address,
      provideValues,
      config.gasPrice,
    );
    expect(provideStatus).toBeTruthy();

    // Swap with TGD
    const swapPairValues: SwapFormValues = {
      From: 1.0,
      To: 0.0, // This is simulated
      selectFrom: tgradeToken,
      selectTo: cw20tokenInfo,
    };
    const swappedStatus = await Token.Swap(signingClient, address, pair, swapPairValues, config.gasPrice);
    expect(swappedStatus).toBeTruthy();

    // Withdraw liquidity
    const allTokens = await Contract20WS.getAll(config, signingClient, address);
    const lpTokenAddress = pair.liquidity_token;
    const lpToken = allTokens[lpTokenAddress];
    expect(lpToken).toBeTruthy();

    const withdrawPairValues: WithdrawFormValues = {
      From: parseFloat(lpToken.humanBalance),
      To: "1.0",
      selectFrom: lpToken,
      selectTo: undefined,
    };

    const withdrawStatus = await Pool.WithdrawLiquidity(
      signingClient,
      address,
      pair,
      withdrawPairValues,
      config.gasPrice,
    );
    expect(withdrawStatus).toBeTruthy();
  }, 50000);
});
