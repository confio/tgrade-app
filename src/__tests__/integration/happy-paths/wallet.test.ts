import { FaucetClient } from "@cosmjs/faucet-client";
import { Decimal } from "@cosmjs/math";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { sendTokens } from "utils/currency";
import { Contract20WS } from "utils/cw20";
import { createSigningClient, generateMnemonic } from "utils/sdk";
import { TcContract } from "utils/trustedCircle";

const mnemonic_01 = generateMnemonic();
const addressPrefix = "tgrade";
const mnemonic_02 = generateMnemonic();
const mnemonic_03 = generateMnemonic();
const mnemonic_04 = generateMnemonic();

describe("Wallet", () => {
  it("Send native token", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: addressPrefix,
    });

    const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_02, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet);
    const { address: walletUserA } = (await wallet.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(walletUserA, config.faucetTokens?.[0] ?? config.feeToken);

    const signingClient_02 = await createSigningClient(config, wallet_02);
    const { address: walletUserB } = (await wallet_02.getAccounts())[0];

    // Before Send
    const walletBalanceUserABeforeSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserABeforeSend.amount)).toBe(10000000);

    const walletBalanceUserBBeforeSend = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceUserBBeforeSend.amount)).toBe(0);

    await sendTokens(signingClient_01, walletUserA, walletUserB, {
      amount: "200000",
      denom: "utgd",
    });

    // After Send
    const walletBalanceUserAAfterSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserAAfterSend.amount)).toBe(9790000);

    const walletBalanceUserBAfterSend = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceUserBAfterSend.amount)).toBe(200000);
  }, 10000);

  it("Send CW20 token", async () => {
    const tokenSymbol = "SUST";
    const tokenName = "Sustainability Coin";
    const tokenDecimals = 1;

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: addressPrefix,
    });

    const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_03, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet);
    const { address: walletUserA } = (await wallet.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(walletUserA, config.faucetTokens?.[0] ?? config.feeToken);

    const signingClient_02 = await createSigningClient(config, wallet_02);
    const { address: walletUserB } = (await wallet_02.getAccounts())[0];

    // Before Send
    const walletBalanceUserABeforeSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserABeforeSend.amount)).toBe(19790000);

    const walletBalanceUserBBeforeSend = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceUserBBeforeSend.amount)).toBe(0);

    const codeId = config.codeIds?.cw20Tokens?.[0] ?? 0;

    const amount = Decimal.fromUserInput("11", 6).atomics;

    // Create digital asset
    const cw20tokenAddress = await Contract20WS.createContract(
      signingClient_01,
      codeId,
      walletUserA,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      [{ address: walletUserA, amount }],
      undefined,
      undefined,
      undefined,
    );

    await Contract20WS.sendTokens(signingClient_01, walletUserA, cw20tokenAddress, walletUserB, "1");

    // After Send
    const walletBalanceUserAAfterSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserAAfterSend.amount)).toBe(19755000);

    const walletBalanceUserBAfterSend = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceUserBAfterSend.amount)).toBe(0);
  }, 15000);

  it("Send Trusted token", async () => {
    const tcName = "Trusted Circle #1";
    const escrowAmount = "1000000";
    const votingPeriod = "19";
    const quorum = "30";
    const threshold = "51";
    const allowEndEarly = true;
    const tokenSymbol = "SUST";
    const tokenName = "Sustainability Coin";
    const tokenDecimals = 1;

    const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: addressPrefix,
    });

    const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_04, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet_01);
    const { address: walletUserA } = (await wallet_01.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(walletUserA, config.faucetTokens?.[0] ?? config.feeToken);

    const signingClient_02 = await createSigningClient(config, wallet_02);
    const { address: walletUserB } = (await wallet_02.getAccounts())[0];

    // Before Send
    const walletBalanceUserABeforeSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserABeforeSend.amount)).toBe(29755000);

    const walletBalanceUserBBeforeSend = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceUserBBeforeSend.amount)).toBe(0);

    const codeId = config.codeIds?.cw20Tokens?.[0] ?? 0;

    // Create Trusted Circle
    const tcContractAddress = await TcContract.createTc(
      signingClient_01,
      config.codeIds?.tgradeDso?.[0] ?? 0,
      walletUserA,
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

    const amount = Decimal.fromUserInput("3", 1).atomics;

    // Create digital asset
    const cw20tokenAddress = await Contract20WS.createContract(
      signingClient_01,
      codeId,
      walletUserA,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      [{ address: walletUserA, amount }],
      undefined,
      undefined,
      tcContractAddress,
    );

    await Contract20WS.sendTokens(signingClient_01, walletUserA, cw20tokenAddress, walletUserB, "1");

    // After Send
    const walletBalanceUserAAfterSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserAAfterSend.amount)).toBe(28695000);

    const walletBalanceUserBAfterSend = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceUserBAfterSend.amount)).toBe(0);
  }, 20000);
});
