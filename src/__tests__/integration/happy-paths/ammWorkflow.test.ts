import { FaucetClient } from "@cosmjs/faucet-client";
import { Decimal, Uint64 } from "@cosmjs/math";
import { config } from "config/network";
import { Contract20WS } from "utils/cw20";
import { Factory } from "utils/factory";
import { createSigningClient, loadOrCreateWallet } from "utils/sdk";
import { Pool, ProvideFormValues, SwapFormValues, Token } from "utils/tokens";

it("creates a CW20 token and swaps it with TGD", async () => {
  const signer = await loadOrCreateWallet(config);
  const signingClient = await createSigningClient(config, signer);
  const address = (await signer.getAccounts())[0].address;
  const faucetClient = new FaucetClient(config.faucetUrl);
  await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

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
    config.gasPrice,
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
  const createPairValues: SwapFormValues = {
    From: 1.0,
    To: 10.0,
    selectFrom: tgradeToken,
    selectTo: cw20tokenInfo,
  };
  const provideValues: ProvideFormValues = {
    assetA: 1.0,
    assetB: 10.0,
    selectFrom: tgradeToken,
    selectTo: cw20tokenInfo,
  };

  await Factory.createPair(signingClient, address, config.factoryAddress, createPairValues, config.gasPrice);
  const pairs = await Factory.getPairs(signingClient, config.factoryAddress);
  expect(pairs).toBeTruthy();

  const pair = pairs[Object.keys(pairs)[Object.keys(pairs).length - 1]];
  const pairAddress = pair.contract_addr;
  await Contract20WS.Authorized(signingClient, cw20tokenInfo.address, address, pairAddress, config.gasPrice);
  const provideStatus = await Pool.ProvideLiquidity(
    signingClient,
    pairAddress,
    address,
    provideValues,
    config.gasPrice,
  );
  expect(provideStatus).toBeTruthy();

  const swapPairValues: SwapFormValues = {
    From: 1.0,
    To: 0.0, // This is simulated
    selectFrom: tgradeToken,
    selectTo: cw20tokenInfo,
  };
  const swappedStatus = await Token.Swap(signingClient, address, pair, swapPairValues, config.gasPrice);
  expect(swappedStatus).toBeTruthy();
}, 30000);
