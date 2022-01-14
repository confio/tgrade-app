import { FaucetClient } from "@cosmjs/faucet-client";
import { config } from "config/network";
import { DsoContract } from "utils/dso";
import { createSigningClient, loadOrCreateWallet } from "utils/sdk";

it("creates a Trusted Circle with a member", async () => {
  const signer = await loadOrCreateWallet(config);
  const signingClient = await createSigningClient(config, signer);
  const address = (await signer.getAccounts())[0].address;

  const faucetClient = new FaucetClient(config.faucetUrl);
  await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

  const dsoName = "Trusted Circle 1";
  const escrowAmount = "1000000";
  const votingDuration = "19";
  const quorum = "30";
  const threshold = "51";
  const members: readonly string[] = ["tgrade1uuy629yfuw2mf383t33x0jk2qwtf6rvv4dhmxs"];
  const allowEndEarly = true;

  const contractAddress = await DsoContract.createDso(
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

  expect(contractAddress.startsWith(config.addressPrefix)).toBeTruthy();
}, 30000);

it("creates a Trusted Circle and adds a member with a proposal", async () => {
  const signer = await loadOrCreateWallet(config);
  const signingClient = await createSigningClient(config, signer);
  const address = (await signer.getAccounts())[0].address;

  const faucetClient = new FaucetClient(config.faucetUrl);
  await faucetClient.credit(address, config.faucetTokens?.[0] ?? config.feeToken);

  const dsoName = "Trusted Circle 2";
  const escrowAmount = "1000000";
  const votingDuration = "19";
  const quorum = "30";
  const threshold = "51";
  const members: readonly string[] = [];
  const allowEndEarly = true;

  const contractAddress = await DsoContract.createDso(
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

  const comment = "Add new member";
  const memberToAdd = "tgrade1uuy629yfuw2mf383t33x0jk2qwtf6rvv4dhmxs";

  const dsoContract = new DsoContract(contractAddress, signingClient, config.gasPrice);
  await dsoContract.propose(address, comment, {
    add_remove_non_voting_members: { remove: [], add: [memberToAdd] },
  });

  const txHash = await dsoContract.executeProposal(address, 1);
  expect(txHash).toBeTruthy();
}, 30000);
