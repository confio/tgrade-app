import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";

import { config } from "../../../config/network";
import { sendTokens } from "../../../utils/currency";
import { createSigningClient, generateMnemonic } from "../../../utils/sdk";

const mnemonic = generateMnemonic();
const addressPrefix = "tgrade";
const mnemonic_02 = generateMnemonic();

describe("Wallet", () => {
  it("Send native token", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
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
  }, 5000);

  it.skip("Send CW20 token", () => {
    //TODO
  });

  it.skip("Send Trusted token", () => {
    //TODO
  });
});
