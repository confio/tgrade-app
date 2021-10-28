import { FaucetClient } from "@cosmjs/faucet-client";
import { Decimal, Uint64 } from "@cosmjs/math";
import { config } from "config/network";
import { Contract20WS } from "utils/cw20";
import { Factory } from "utils/factory";
import { createSigningClient, loadOrCreateWallet } from "utils/sdk";
import { SwapFormValues } from "utils/tokens";

it("creates a Digital Asset", async () => {
  const signer = await loadOrCreateWallet(config);
  const signingClient = await createSigningClient(config, signer);
  const address = (await signer.getAccounts())[0].address;
  const faucetClient = new FaucetClient(config.faucetUrl);
  await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

  const tokenSymbol = "TST";
  const tokenName = "Test Token";
  const tokenDecimals = 3;
  const tokenInitialSupply = "100000";

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

  const cw20tokenInfo = await signingClient.queryContractSmart(cw20tokenAddress, {
    token_info: {},
  });

  const { amount: balance_utgd } = await signingClient.getBalance(address, config.feeToken);
  const pairValues: SwapFormValues = {
    From: 1.0,
    To: 1.0,
    selectFrom: {
      address: config.feeToken,
      balance: balance_utgd,
      humanBalance: Decimal.fromAtomics(balance_utgd, config.coinMap.utgd.fractionalDigits).toString(),
      decimals: config.coinMap.utgd.fractionalDigits,
      name: "Tgrade",
      symbol: config.coinMap.utgd.denom,
      total_supply: "",
    },
    selectTo: cw20tokenInfo,
  };

  await Factory.createPair(signingClient, address, config.factoryAddress, pairValues, config.gasPrice);
  const pairs = await Factory.getPairs(signingClient, config.factoryAddress);
});

/*   const provideValues: ProvideFormValues = {
    assetA: 1.0,
    assetB: 1.0,
    selectFrom: {
      address: config.feeToken,
      balance: balance_utgd,
      humanBalance: Decimal.fromAtomics(balance_utgd, config.coinMap.utgd.fractionalDigits).toString(),
      decimals: config.coinMap.utgd.fractionalDigits,
      name: "Tgrade",
      symbol: config.coinMap.utgd.denom,
      total_supply: "",
    },
    selectTo: cw20tokenInfo,
  }; */
//  await Pool.ProvideLiquidity(signingClient, pairs[0].contract_addr, address, provideValues, config.gasPrice);
//  const result = await Token.Swap(signingClient, address, pairs[0], swapValues, config.gasPrice);
