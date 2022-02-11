import { Random } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { makeCosmoshubPath } from "@cosmjs/stargate";
import { config } from "config/network";
import { createSigningClient } from "utils/sdk";
import { TcContract, TcContractQuerier } from "utils/trustedCircle";

const tcName = "Trusted Circle 1";
const escrowAmount = "1000000";
const votingPeriod = "19";
const quorum = "30";
const threshold = "51";
const members: readonly string[] = [makeRandomAddress()];
const allowEndEarly = true;

const mnemonic = process.env.SECRET_MNEMONIC || ""; // to run locally use real mnemonic instead
const addressPrefix = "tgrade";

describe("Trusted Circle", () => {
  it("Create a Trusted circle", async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [makeCosmoshubPath(0)],
      prefix: addressPrefix,
    });

    const signingClient = await createSigningClient(config, wallet);
    const { address } = (await wallet.getAccounts())[0];

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
      [{ denom: config.feeToken, amount: escrowAmount }],
      config.gasPrice,
    );

    const dsoContract = new TcContractQuerier(tcContractAddress, signingClient);
    const dsoResponse = await dsoContract.getTc();

    expect(dsoResponse.escrow_amount).toBe(escrowAmount);
    expect(dsoResponse.escrow_pending).toBe(null);
    expect(dsoResponse.rules.voting_period.toString()).toBe(votingPeriod);
    expect(dsoResponse.rules.quorum).toBe("0.3");
    expect(dsoResponse.rules.threshold).toBe("0.51");
    expect(dsoResponse.rules.allow_end_early).toBe(allowEndEarly);
    expect(tcContractAddress.startsWith(config.addressPrefix)).toBeTruthy();
  });

  it("Create every type of TC proposal and execute them", () => {
    //TODO
  });

  it("Add another voting member", () => {
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
