import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { FaucetClient } from "@cosmjs/faucet-client";
import { Decimal, Uint64 } from "@cosmjs/math";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import tempImgUrl from "App/assets/icons/token-placeholder.png";

import { config } from "../../../config/network";
import { Contract20WS } from "../../../utils/cw20";
import { Factory } from "../../../utils/factory";
import { createSigningClient, generateMnemonic, loadOrCreateWallet } from "../../../utils/sdk";
import { SwapFormValues } from "../../../utils/tokens";
import { TcContract } from "../../../utils/trustedCircle";

const tcName = "Trusted Circle #1";
const escrowAmount = "1000000";
const votingPeriod = "19";
const quorum = "30";
const threshold = "51";
const members: readonly string[] = [makeRandomAddress()];
const allowEndEarly = true;
const comment = "Comment message";

const mnemonic = generateMnemonic();
console.log(mnemonic);

describe("T-Market", () => {
  it("Create a digital asset with logo", async () => {
    // Create token
    const tokenSymbol = "BTC";
    const tokenName = "Bitcoin";
    const tokenDecimals = 6;
    const tokenInitialSupply = "999999999";

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
    expect(tokens[tcTokenAddress].name).toBe(tokenName);
    expect(tokens[tcTokenAddress].symbol).toBe(tokenSymbol);
    expect(tokens[tcTokenAddress].decimals).toBe(tokenDecimals);
    expect(tokens[tcTokenAddress].total_supply).toBe(tokenInitialSupply + "000000");
    expect(tokens[tcTokenAddress].balance).toBe(tokenInitialSupply + "000000");
    expect(tokens[tcTokenAddress].humanBalance).toBe(tokenInitialSupply);
    expect(tokens[tcTokenAddress].address).toContain(config.addressPrefix);
    expect(tokens[tcTokenAddress].img).toBe(tempImgUrl);
  }, 15000);

  xit("Create a digital asset without logo", async () => {
    //TODO
  });

  it("Create a trading pair", async () => {
    const tokenSymbol = "SUST";
    const tokenName = "Sustainability Coin";
    const tokenDecimals = 2;
    const tokenInitialSupply = "66666666666";

    const signer = await loadOrCreateWallet(config);
    const signingClient = await createSigningClient(config, signer);
    const address = (await signer.getAccounts())[0].address;

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

    const codeId = config.codeIds?.cw20Tokens?.[0] ?? 0;

    const amount = Decimal.fromUserInput(tokenInitialSupply, tokenDecimals)
      .multiply(Uint64.fromNumber(10 ** tokenDecimals))
      .toString();

    // Create digital asset
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
      To: 5.0,
      selectFrom: tgradeToken,
      selectTo: cw20tokenInfo,
    };

    // Create trading pair
    await Factory.createPair(
      signingClient,
      address,
      config.factoryAddress,
      createPairValues,
      config.gasPrice,
    );
    const pairs = await Factory.getPairs(signingClient, config.factoryAddress);
    expect(pairs["utgd-" + cw20tokenAddress].asset_infos[0].native).toContain("utgd");
    expect(pairs["utgd-" + cw20tokenAddress].asset_infos[1].native).toContain(config.addressPrefix);
    expect(pairs["utgd-" + cw20tokenAddress].contract_addr).toContain(config.addressPrefix);
    expect(pairs["utgd-" + cw20tokenAddress].liquidity_token).toContain(config.addressPrefix);
    expect(pairs["utgd-" + cw20tokenAddress].commission).toBe("0.003");
  }, 15000);

  it.skip("Provide liquidity to a trading pair", async () => {
    //TODO
  });

  it.skip("Exchange tokens from the created trading pair", () => {
    //TODO
  });

  it.skip("Withdraw liquidity tokens", () => {
    //TODO
  });
});

function makeRandomAddress(): string {
  return Bech32.encode("tgrade", Random.getBytes(20));
}
