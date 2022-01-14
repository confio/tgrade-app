import { FaucetClient } from "@cosmjs/faucet-client";
import { Decimal, Uint64 } from "@cosmjs/math";
import { config } from "config/network";
import { Contract20WS } from "utils/cw20";
import { DsoContract } from "utils/dso";
import { Factory } from "utils/factory";
import { createSigningClient, loadOrCreateWallet } from "utils/sdk";
import { Pool, ProvideFormValues, SwapFormValues, Token, WithdrawFormValues } from "utils/tokens";

it("creates a CW20 token, swaps it with TGD, withdraws liquidity", async () => {
  const signer = await loadOrCreateWallet(config);
  const signingClient = await createSigningClient(config, signer);
  const address = (await signer.getAccounts())[0].address;
  const faucetClient = new FaucetClient(config.faucetUrl);
  await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

  // Create token
  const tokenSymbol = "TST";
  const tokenName = "Test Token";
  const tokenDecimals = 6;
  const tokenInitialSupply = "100000000";

  const codeId = config.codeIds?.cw20Tokens?.[0] ?? 0;

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
    undefined,
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

  await Factory.createPair(signingClient, address, config.factoryAddress, createPairValues, config.gasPrice);
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
}, 60000);

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

  const dsoAddress = await DsoContract.createDso(
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

  await Factory.createPair(signingClient, address, config.factoryAddress, createPairValues, config.gasPrice);
  const pairs = await Factory.getPairs(signingClient, config.factoryAddress);
  expect(pairs).toBeTruthy();

  // Whitelist pair on Trusted Circle
  const comment = "Whitelist tgd-tst";
  const pair = pairs[`${tgradeToken.address}-${cw20tokenInfo.address}`];
  const pairAddress = pair.contract_addr;

  const dsoContract = new DsoContract(dsoAddress, signingClient, config.gasPrice);
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
}, 60000);
