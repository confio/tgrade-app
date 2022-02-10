# tgrade upgrade guide

Without new PoE contracts of DeFi contract upgrades.

* For the version you want to upgrade too, check a docker artifact exists at https://hub.docker.com/r/confio/tgrade/tags
* Create a new branch in tgrade-app. for example: `git checkout -b tgrade-upgrade-v0.6beta1`
* Jump into the `./scripts/tgrade` folder `cd scripts/tgrade`
* Bump tgrade version in `env` file
* Run `./generate_template.sh` to generate a new `template` folder
* Replace key files with existing ones
    `git restore template/node0/tgrade/keyring-test/systemadmin.info \
    template/node0/tgrade/keyring-test/node0.info \
    template/node0/tgrade/key_seed.json \
    template/node0/tgrade/config/priv_validator_key.json \
    template/node0/tgrade/config/node_key.json \
    template/gentxs/node0.json
    ` to have minimal diff and stability.
* Apply useful/ required changes in
  * `template/node0/tgrade/config/app.toml`
  * `template/node0/tgrade/config/config.toml`
  * `template/node0/tgrade/config/genesis.json`
  * ensure **not to change**
    - chain-id
    - persistent_peers
    - account addresses
    - gen_txs
    - contract configs for tests (like short voting period...)
* Test backend via `start_debug.sh`
* Some changes might be needed on `src/config/network.ts`
  * `chainId`: it should match the `chain_id` of the template.
  * `factoryAddress`: it should match the address of the factory logged when running `./start_all.sh`.
  * `codeIds`: when running `./start_all.sh`, make sure the code IDs match the contracts in this field.
* Test all from `script` folder: `cd ..`
  * run `./start_all.sh` to start chain, seed contracts, start faucet
  * in project root, check webapp still works via `yarn install;yarn start:local`

