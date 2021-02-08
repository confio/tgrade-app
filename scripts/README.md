# Local Blockchain

Quick start:

```bash
./scripts/start_all.sh
```

After this finishes, you should have a blockchain and faucet running locally.
Tendermint rpc on port 26657 and faucet on 8000.

Now you can test the webapp locally:

```bash
yarn start:local
```

When you want to stop it:

```bash
./script/stop_all.sh
```

## Notes

We start a single-node wasmd blockchain (port 26657), then connect a faucet (port 8000) pointing to it
(the mnemonic must match the address in the genesis file). Currently, we also run a cors proxy in front
of the faucet (port 8001), so we can use it from the browser (this should work without, not sure why).

Let's remove the proxy when the faucet handles this natively.