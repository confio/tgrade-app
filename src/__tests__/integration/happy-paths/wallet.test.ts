import { FaucetClient } from "@cosmjs/faucet-client";
import { Decimal } from "@cosmjs/math";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { sendTokens } from "utils/currency";
import { Contract20WS } from "utils/cw20";
import { createSigningClient, generateMnemonic, getCodeIds } from "utils/sdk";
import { TcContract } from "utils/trustedCircle";

const mnemonic_01 = generateMnemonic();
const mnemonic_02 = generateMnemonic();
const mnemonic_03 = generateMnemonic();
const mnemonic_04 = generateMnemonic();
const addressPrefix = "tgrade";

describe("Wallet", () => {
  it("Send native token", async () => {
    const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: addressPrefix,
    });

    const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_02, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet_01);
    const { address: walletUserA } = (await wallet_01.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(walletUserA, config.faucetTokens?.[0] ?? config.feeToken);

    const signingClient_02 = await createSigningClient(config, wallet_02);
    const { address: walletUserB } = (await wallet_02.getAccounts())[0];

    // User_A wallet before send
    const walletBalanceUserABeforeSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserABeforeSend.amount)).toBe(10000000);

    // User_B wallet before send
    const walletBalanceUserBBeforeSend = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceUserBBeforeSend.amount)).toBe(0);

    await sendTokens(signingClient_01, walletUserA, walletUserB, {
      amount: "200000",
      denom: "utgd",
    });

    // User_A wallet after send
    const walletBalanceUserAAfterSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserAAfterSend.amount)).toBe(9790000);

    // User_B wallet after send
    const walletBalanceUserBAfterSend = await signingClient_02.getBalance(walletUserB, config.feeToken);
    expect(parseInt(walletBalanceUserBAfterSend.amount)).toBe(200000);
  }, 10000);

  it("Send CW20 token", async () => {
    const tokenSymbol = "SUST";
    const tokenName = "Sustainability Coin";
    const tokenDecimals = 1;

    const wallet_01 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_01, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: addressPrefix,
    });

    const wallet_02 = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic_03, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: config.addressPrefix,
    });

    const signingClient_01 = await createSigningClient(config, wallet_01);
    const { address: walletUserA } = (await wallet_01.getAccounts())[0];

    const faucetClient = new FaucetClient(config.faucetUrl);
    await faucetClient.credit(walletUserA, config.faucetTokens?.[0] ?? config.feeToken);

    const signingClient_02 = await createSigningClient(config, wallet_02);
    const { address: walletUserB } = (await wallet_02.getAccounts())[0];

    const codeIds = await getCodeIds(config, signingClient_01);

    const amount = Decimal.fromUserInput("1000", 6).atomics;

    // Create digital asset
    const cw20tokenAddress = await Contract20WS.createContract(
      signingClient_01,
      codeIds.token,
      walletUserA,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      [{ address: walletUserA, amount }],
      undefined,
      undefined,
      undefined,
    );

    // User_A wallet before send
    const walletBalanceUserABeforeSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserABeforeSend.amount)).toBe(19765000);

    // User_B wallet before send
    const walletBalanceUserBBeforeSend = (await Contract20WS.getBalance(
      signingClient_02,
      cw20tokenAddress,
      walletUserB,
    )) as unknown as { balance: string };
    expect(parseInt(walletBalanceUserBBeforeSend.balance)).toBe(0);

    // Send tokens
    await Contract20WS.sendTokens(signingClient_01, walletUserA, cw20tokenAddress, walletUserB, "2300");

    // User_A wallet after send
    const walletBalanceUserAAfterSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserAAfterSend.amount)).toBe(19755000);

    // User_B wallet after send
    const walletBalanceUserBAfterSend = (await Contract20WS.getBalance(
      signingClient_02,
      cw20tokenAddress,
      walletUserB,
    )) as unknown as { balance: string };
    expect(parseInt(walletBalanceUserBAfterSend.balance)).toBe(2300);
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

    const codeIds = await getCodeIds(config, signingClient_01);

    // Create Trusted Circle
    const tcContractAddress = await TcContract.createTc(
      signingClient_01,
      codeIds.trustedCircle,
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

    const amount = Decimal.fromUserInput("1000", 6).atomics;

    // Create digital asset
    const cw20tokenAddress = await Contract20WS.createContract(
      signingClient_01,
      codeIds.trustedToken,
      walletUserA,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      [{ address: walletUserA, amount }],
      undefined,
      undefined,
      tcContractAddress,
    );

    // User_A wallet before send
    const walletBalanceUserABeforeSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserABeforeSend.amount)).toBe(28705000);

    // User_B wallet before send
    const walletBalanceUserBBeforeSend = (await Contract20WS.getBalance(
      signingClient_02,
      cw20tokenAddress,
      walletUserB,
    )) as unknown as { balance: string };
    expect(parseInt(walletBalanceUserBBeforeSend.balance)).toBe(0);

    // Send tokens
    await Contract20WS.sendTokens(signingClient_01, walletUserA, cw20tokenAddress, walletUserB, "5250");

    // User_A wallet after send
    const walletBalanceUserAAfterSend = await signingClient_01.getBalance(walletUserA, config.feeToken);
    expect(parseInt(walletBalanceUserAAfterSend.amount)).toBeLessThan(
      parseInt(walletBalanceUserABeforeSend.amount),
    );

    // User_B wallet after send
    const walletBalanceAfterSend = (await Contract20WS.getBalance(
      signingClient_02,
      cw20tokenAddress,
      walletUserB,
    )) as unknown as { balance: string };
    expect(parseInt(walletBalanceAfterSend.balance)).toBe(5250);
  }, 20000);
});
