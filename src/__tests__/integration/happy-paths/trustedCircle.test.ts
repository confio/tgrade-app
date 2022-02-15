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
  it.skip("Create a Trusted circle", async () => {
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

    const tcContract = new TcContractQuerier(tcContractAddress, signingClient);
    const tcResponse = await tcContract.getTc();

    expect(tcResponse.escrow_amount).toBe(escrowAmount);
    expect(tcResponse.escrow_pending).toBeNull();
    expect(tcResponse.rules.voting_period.toString()).toBe(votingPeriod);
    expect(tcResponse.rules.quorum).toBe("0.3");
    expect(tcResponse.rules.threshold).toBe("0.51");
    expect(tcResponse.rules.allow_end_early).toBe(allowEndEarly);
    expect(tcContractAddress.startsWith(config.addressPrefix)).toBeTruthy();
  });

  it.skip("Create every type of TC proposal and execute them", () => {
    //TODO
  });

  it.skip("Add another voting member", () => {
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
