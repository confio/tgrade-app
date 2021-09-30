**Technical Guide - Creating d’Apps for a Syndicated loans**

- Syndicated loan d’Apps deployed to Tgrade network and exchangeable on a marketplace

**Installation**

To develop, deploy and interact smart contracts to [Tgrade](https://tgrade.finance/#work) it is necessary to install [Cosmos SDK](https://docs.cosmwasm.com/docs/1.0/getting-started/installation).

The coding sequence for smart contracts are represented here as a [series of videos, leading you through the code structure](https://vimeo.com/showcase/6671477).

References and documentation about Tgrade can be found [here.](https://github.com/confio/tgrade-docs)

**Setting up the environment**

- **The Test Net**

To run contracts is necessary to setup an environment.

A contract can be easily deployed and run on Oysternet as test net.

Before connecting to Oysternet, it is necessary to check up that the test net is up and running and these links [rpc](http://rpc.oysternet.cosmwasm.com/status), [faucet](https://faucet.oysternet.cosmwasm.com/status) and [lcd](http://lcd.oysternet.cosmwasm.com/node_info) are working as well. **(links need updating and made available)**

More information about other test net including Oysternet [here](https://github.com/CosmWasm/testnets) and how to join the test net [here.](https://docs.cosmwasm.com/ecosystem/testnets/testnets)

- **User create a trusted circle DSO**

How to understand trusted circle – DSO you find it [here](https://tgrade.finance/wp-content/uploads/2021/04/Decentralized-Social-Organisation-Introduction.pdf).

More details about how to setup a trusted circle you find [here](https://docs.servicenow.com/bundle/rome-security-management/page/product/trusted-circles/concept/admin-trusted-circles.html#create-profile) and [here.](https://medium.com/tgradefinance/trusted-circles-and-front-running-46ce693ab10e)

- **Setup Command Line Interface – CLI**

Let's configure wasmd exec, point it to test net, create wallet and ask tokens from faucet:

- First, source the Oysternet network configurations to the shell:

      "source <(curl -sSL <https://raw.githubusercontent.com/CosmWasm/testnets/master/oysternet-1/defaults.env>)"

- Setup the client

      # add wallets for testing
      	wasmd keys add fred
      >
      {
      	"name": "fred",
      	"type": "local",
      	"address": "wasm13nt9rxj7v2ly096hm8qsyfjzg5pr7vn5saqd50",*
      	"pubkey": "wasmpub1addwnpepqf4n9afaefugnfztg7udk50duwr4n8p7pwcjlm9tuumtlux5vud6qvfgp9g",
      	"mnemonic": "hobby bunker rotate piano satoshi planet network verify else market spring toward pledge turkey tip slim word jaguar congress thumb flag project chalk inspire"
      }
      wasmd keys add bob
      wasmd keys add thief

- Interacting with the network

You use wasmd which is a Go Client. Here you need to create some tokens in your the address to interact with the network. Requesting tokens from faucet:

    "JSON=$(jq -n --arg addr $(wasmd keys show -a fred) '{"denom":"usponge","address":$addr}') && curl -X POST --header "Content-Type: application/json" --data "$JSON" <https://faucet.oysternet.cosmwasm.com/credit>"
    "JSON=$(jq -n --arg addr $(wasmd keys show -a thief) '{"denom":"usponge","address":$addr}') && curl -X POST --header "Content-Type: application/json" --data "$JSON" <https://faucet.oysternet.cosmwasm.com/credit>"

- Export wasmd parameters

When using wasmd as client, there are some variables that have to be setup. Contrary you have to define type in node, chain – ID, and gas - price details with every executed command.

You have to make sure to export these variables before proceeding, once they are setup.

    \# bash
    export NODE="--node $RPC"
    export TXFLAG="${NODE} --chain-id ${CHAIN\_ID} --	gas-prices 0.001usponge --gas auto --gas-adjustment 	1.3"

    \# zsh
    export NODE=(--node $RPC)
    *export TXFLAG=($NODE --chain-id $CHAIN\_ID --gas-	prices 0.001usponge --gas auto --gas-adjustment 	1.3)

If running the command above throws error, than means that your shell is different. If there are not resulting errors, try running this:

    wasmd query bank total $NODE

- **CW20 token**

Details about CW20 can be found in the usage manual [here.](https://docs.cosmwasm.com/cw-plus/0.9.0/cw20/cw20-base-tutorial) and [here.](https://github.com/CosmWasm/cw-plus)

This token contract is implemented under the CW20 standard and it fully supports terraswap feature. Except any function of your token itself contains more than asset, we recommend to mint your own token by instantiating this binary, rather than developing your own.

- **How to mint?**

Using the pre-stored binary (recommended)
The standard CW20 token is already stored in Terra network as code ID 3.

_Please check [here](https://docs.terraswap.io/docs/contract_resources/contract_addresses/) for more addresses._

You may instantiate your own token using the JSON as follows:

    {
    	"name":"yout\_token\_name",
    	"symbol":"SYMBOL",
    	"decimals":3,
    	"initial\_balances":[
    		{
    			"address": "terraaddress0001asdfsdfbqwer...",
    			"amount": "10000"
    	},
    	{
    			"address":"terraaddress0002asdfsdfbqwer...",
    			"amount":"10000"
    	},
    	...
    	]
    }

Then, the CLI reads:

    terracli tx wasm instantiate <token\_bin\_code> '{"name": "yout\_token\_name", "symbol": "SYMBOL", "decimals": 3, ... }' --from your\_key

After confirmation, your token is minted on terra network! With your tx hash, you may query the tx:

    terracli query tx EF2REFAWE234A2EFV....

Then, you may find the address of your contract from:

    {
    	"key": "contract\_address",
    	"value": "terra18vd8fpwxzck93qlwghaj6arh4p7c5n896xzem5"
    }

- Implement yourself – you find more details [here](https://docs.terraswap.io/docs/howto/token/)

**Downloading and compiling contracts**

In this section we will download a sample contract and compile it to wasm binary executable.

Now, we will download the repo in which we collect [cw-examples](https://github.com/CosmWasm/cw-examples) and try out a simple name service contract where mimics a name service marketplace.

This is also de-facto cosmos – sdk entrance tutorial.

First clone the repo, then try to build the wasm bundle:

    \# get the code
    git clone https://github.com/CosmWasm/cw-examples
    cd cw-examples
    git fetch --tags
    git checkout nameservice-0.11.0
    cd nameservice
    cargo wasm

After compiles it should produce a file in:

    target/wasm32-unknown-unknown/release/cw\_nameservice.wasm

A quick **ls-lh** should show around 1,7Mb. This is a release build, but not stripped of all unnecessary code. To produce a much smaller version, you can run this which tells the compiler to strip all unused code out:

    RUSTFLAGS='-C link-arg=-s' cargo wasm

This produces a file about 162 kb. We use this and another optimizer (Optimize compilation section) to produce the final product uploaded to Tgrade. You don’t need to worry about running this yourself but you should have an idea of the final size of your contract, this way.

You can also run Units Tests and Optimize Compilation – more details[ here](https://docs.cosmwasm.com/docs/0.16/getting-started/compile-contract).

## Deploying and Interacting

We generated a wasm binary executable, now let’s put it into use.

- Connecting to Testnet 2

The following data is all we need to connect to `tgrade-testnet-2`:

- **Chain ID**: tgrade-testnet-2
- **Date Deployed**: 2021-08-27T12:00:01Z
- **Staking, Fee token**: utgd
- **Min Fee**: 0.01utgd
- **app**: tgrade
- **version**: "v0.4.0-rc1" commit 4146b465a6576930504482c814922b90f23504ae

* [RPC](https://rpc.testnet-2.tgrade.io) - public RPC endpoint
* [LCD](https://lcd.testnet-2.tgrade.io) - public LCD endpoint
* [FAUCET](https://faucet.testnet-2.tgrade.io) - faucet
* [Aneka/BLOCK EXPLORER](https://testnet.tgrade.aneka.io) - block explorer

### Uploading the contract

Now we will upload the code to Tgrade. Afterwards we can download the bytecode to verify if it is proper

```bash
	# see how many codes we have now
	tgrade query wasm list-code $NODE

	# gas is huge due to wasm size... but auto-zipping reduced this from 1.8M to around 600k

	# you can see the code in the result
	RES=$(tgrade tx wasm store artifacts/cw_nameservice.wasm --from wallet $TXFLAG -y)

	# you can also get the code this way
	CODE_ID=$(echo $RES | jq -r '.logs[0].events[-1].attributes[0].value')

	# no contracts yet, this should return an empty list
	tgrade query wasm list-contract-by-code $CODE_ID $NODE --output json

	# you can also download the wasm from the chain and check that the diff between them is empty
	tgrade query wasm code $CODE_ID $NODE download.wasm
	diff artifacts/cw_nameservice.wasm download.wasm
```

### Instantiating the contract

We can create an instance of this wasm contract. The verifier will find an escrow that will allow wallet to control payout and upon release the funds go to bob.

```bash
# instantiate contract and verify
INIT='{"purchase_price":{"amount":"100","denom":"utgd"},"transfer_price":{"amount":"999","denom":"utgd"}}'
tgrade tx wasm instantiate $CODE_ID "$INIT" \
	--from wallet --label "awesome name service" $TXFLAG -y

# check the contract state (and account balance)
tgrade query wasm list-contract-by-code $CODE_ID $NODE --output json
CONTRACT=$(tgrade query wasm list-contract-by-code $CODE_ID $NODE --output json | jq -r '.contracts[-1]')
echo $CONTRACT
tgrade query wasm contract $CONTRACT $NODE

# you can dump entire contract state
tgrade query wasm contract-state all $CONTRACT $NODE

# Note that keys are hex encoded, and val is base64 encoded.

# To view the returned data (assuming it is ascii), try something like:

# (Note that in many cases the binary data returned is non in ascii format, thus the encoding)
tgrade query wasm contract-state all $CONTRACT $NODE --output "json" | jq -r '.models[0].key' | xxd -r -ps
tgrade query wasm contract-state all $CONTRACT $NODE --output "json" | jq -r '.models[0].value' | base64 -d

# or try a "smart query", executing against the contract
tgrade query wasm contract-state smart $CONTRACT '{}' $NODE

# (since we didn't implement any valid QueryMsg, we just get a parse error back)
```

Once contract instantiated let’s register a name and transfer it with paying its price.

```bash
# execute fails if wrong person
REGISTER='{"register":{"name":"fred"}}'
tgrade tx wasm execute $CONTRACT "$REGISTER" \
	--amount 100utgd \
	--from wallet $TXFLAG -y

# query name record
NAME_QUERY='{"resolve_record": {"name": "fred"}}'
tgrade query wasm contract-state smart $CONTRACT "$NAME_QUERY" $NODE --output json

# {"data":{"address":"tgrade1av9uhya7ltnusvunyqay3xcv9x0nyc872cheu5"}}

# buy and transfer name record to wallet2
TRANSFER='{"transfer":{"name":"fred","to":"tgrade1um2e88neq8sxzuuem5ztt9d0em033rpr5ps9tv"}}'
tgrade tx wasm execute $CONTRACT "$TRANSFER" \
	--amount 999utgd \
	--from wallet2 $TXFLAG -y
```

Query record to see the new owner address

```bash
NAME_QUERY='{"resolve_record": {"name": "fred"}}'
tgrade query wasm contract-state smart $CONTRACT "$NAME_QUERY" $NODE --output json

# {"data":{"address":"tgrade1um2e88neq8sxzuuem5ztt9d0em033rpr5ps9tv"}}
```

### Storing a wasm contract to Tgrade chain

The storing command of a wasm contract

```bash
tgrade tx wasm store tgrade_dso.wasm --from bob --node https://rpc.testnet-2.tgrade.io --chain-id tgrade-testnet-2 --gas auto --gas-adjustment 1.3 --fee
```
