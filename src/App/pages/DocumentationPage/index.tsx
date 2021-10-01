import {
  StyledMenu,
  StyledSubmenu,
  StyledItemGroup,
  StyledMenuItem,
  PageWrapper,
  ContentWrapper,
  Title,
  Subtitle,
  Text,
} from "./style";
import { CopyBlock, monokai } from "react-code-blocks";

export default function DocumentationPage(): JSX.Element | null {
  /* This is code to load & parse a local file
     easy to adapt to fetching a md from github.

  const [postMarkdown, setPostMarkdown] = useState("");
  const file_name = "tech-guide.md";
  useEffect(() => {
    import(`./${file_name}`)
      .then((res) => {
        fetch(res.default)
          .then((res) => res.text())
          .then((res) => setPostMarkdown(res))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
  */

  return (
    <PageWrapper>
      <StyledMenu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline">
        <StyledSubmenu key="sub1" icon={undefined} title="Introduction">
          <StyledItemGroup key="g1" title="Smart Contracts">
            <StyledMenuItem key="1">
              <a href="#installation">Installation</a>
            </StyledMenuItem>
            <StyledMenuItem key="2">
              <a href="#environment">Setting up Environment</a>
            </StyledMenuItem>
            <StyledMenuItem key="3">
              <a href="#trustedcircle">Create a trusted circle</a>
            </StyledMenuItem>
            <StyledMenuItem key="4">
              <a href="#setupcli">Setup – CLI</a>
            </StyledMenuItem>
            <StyledMenuItem key="5">
              <a href="#cw20">CW20 token</a>
            </StyledMenuItem>
            <StyledMenuItem key="6">
              <a href="#mint">How to mint?</a>
            </StyledMenuItem>
            <StyledMenuItem key="7">
              <a href="#download">Downloading and compiling contracts</a>
            </StyledMenuItem>
            <StyledMenuItem key="8">
              <a href="#deploy">Deploying and Interacting</a>
            </StyledMenuItem>
            <StyledMenuItem key="8">
              <a href="#upload">Uploading a contract</a>
            </StyledMenuItem>
            <StyledMenuItem key="9">
              <a href="#instantiating">Instantiating the contract</a>
            </StyledMenuItem>
            <StyledMenuItem key="8">
              <a href="#store">Storing a contract</a>
            </StyledMenuItem>
          </StyledItemGroup>
        </StyledSubmenu>
      </StyledMenu>
      <ContentWrapper>
        <Title>Technical Guide - Creating d’Apps for a Syndicated loans</Title>
        <Subtitle>
          Syndicated loan d’Apps deployed to Tgrade network and exchangeable on a marketplace
        </Subtitle>
        <Title id="installation">Installation</Title>
        <Text>
          To develop, deploy and interact smart contracts to <a href="https://tgrade.finance/#work">Tgrade</a>{" "}
          it is necessary to install{" "}
          <a href="https://docs.cosmwasm.com/docs/1.0/getting-started/installation">Cosmos SDK</a>. The coding
          sequence for smart contracts are represented here as a{" "}
          <a href="https://vimeo.com/showcase/6671477">
            series of videos, leading you through the code structure
          </a>
          . References and documentation about Tgrade can be found{" "}
          <a href="https://github.com/confio/tgrade-docs">here.</a>
        </Text>
        <Title id="environment">Setting up the environment</Title>
        <Subtitle>The Test Net</Subtitle>
        <Text>
          To run contracts is necessary to setup an environment. A contract can be easily deployed and run on
          Oysternet as test net. Before connecting to Oysternet, it is necessary to check up that the test net
          is up and running and these links <a href="http://rpc.oysternet.cosmwasm.com/status">rpc</a> ,{" "}
          <a href="https://faucet.oysternet.cosmwasm.com/status">faucet</a> and{" "}
          <a href="http://lcd.oysternet.cosmwasm.com/node_info">lcd</a> are working as well.{" "}
          <b>links need updating and made available</b> More information about other test net including
          Oysternet <a href="https://github.com/CosmWasm/testnets">here</a> and how to join the test net{" "}
          <a href="https://docs.cosmwasm.com/ecosystem/testnets/testnets">here</a>
        </Text>
        <Subtitle id="trustedcircle">User create a trusted circle (DSO)</Subtitle>
        <Text>
          How to understand trusted circle – DSO you find it
          <a href="https://tgrade.finance/wp-content/uploads/2021/04/Decentralized-Social-Organisation-Introduction.pdf">
            {" "}
            here.
          </a>
          <br />
          More details about how to setup a trusted circle you find
          <a href="https://docs.servicenow.com/bundle/rome-security-management/page/product/trusted-circles/concept/admin-trusted-circles.html#create-profile">
            {" "}
            here.
          </a>
          and{" "}
          <a href="https://medium.com/tgradefinance/trusted-circles-and-front-running-46ce693ab10e"> here.</a>
        </Text>
        <Subtitle id="setupcli">Setup Command Line Interface – CLI</Subtitle>
        <Text>
          Let's configure wasmd exec, point it to test net, create wallet and ask tokens from faucet:
          <br />
          -First, source the Oysternet network configurations to the shell:
        </Text>

        <CopyBlock
          text={
            "source <(curl -sSL <https://raw.githubusercontent.com/CosmWasm/testnets/master/oysternet-1/defaults.env>)"
          }
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>Add wallets for testing</Text>
        <CopyBlock
          text={`	
            wasmd keys add fred
          >
          {
            "name": "fred",
            "type": "local",
            "address": "wasm13nt9rxj7v2ly096hm8qsyfjzg5pr7vn5saqd50",*
            "pubkey": "wasmpub1addwnpepqf4n9afaefugnfztg7udk50duwr4n8p7pwcjlm9tuumtlux5vud6qvfgp9g",
            "mnemonic": "hobby bunker rotate piano satoshi planet network verify else market spring
                         toward pledge turkey tip slim word jaguar congress thumb flag project chalk 
                         inspire"
          }
          wasmd keys add bob
          wasmd keys add thief
      `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>
          <b>Interacting with the network</b>
        </Text>
        <Text>
          You use wasmd which is a Go Client. Here you need to create some tokens in your the address to
          interact with the network. Requesting tokens from faucet:
        </Text>
        <CopyBlock
          text={`	
          JSON=$(jq -n --arg addr $(wasmd keys show -a fred) '{"denom":"usponge","address":$addr}') 
          && curl -X POST --header "Content-Type: application/json" --data "$JSON" <https://faucet.oysternet.cosmwasm.com/credit>
          JSON=$(jq -n --arg addr $(wasmd keys show -a thief) '{"denom":"usponge","address":$addr}') 
          && curl -X POST --header "Content-Type: application/json" --data "$JSON" <https://faucet.oysternet.cosmwasm.com/credit>
      `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Subtitle>Export wasmd parameters</Subtitle>
        <Text>
          When using wasmd as client, there are some variables that have to be setup. Contrary you have to
          define type in node, chain – ID, and gas - price details with every executed command. You have to
          make sure to export these variables before proceeding, once they are setup.
        </Text>
        <CopyBlock
          text={`	
          # bash
          export NODE="--node $RPC"
          export TXFLAG="$ {NODE} --chain-id $ {CHAIN_ID} --	gas-prices 0.001usponge --gas auto --gas-adjustment 	1.3"
          
          # zsh
          export NODE=(--node $RPC)
          *export TXFLAG=($NODE --chain-id $CHAIN_ID --gas-	prices 0.001usponge --gas auto --gas-adjustment 	1.3)
      `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>
          If running the command above throws error, than means that your shell is different. If there are not
          resulting errors, try running this:
        </Text>
        <CopyBlock
          text={`	
          wasmd query bank total $NODE
      `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Title id="cw20">CW20 token</Title>
        <Text>
          Details about CW20 can be found in the usage manual{" "}
          <a href="https://docs.cosmwasm.com/cw-plus/0.9.0/cw20/cw20-base-tutorial">here</a> and{" "}
          <a href="https://github.com/CosmWasm/cw-plus">here</a> This token contract is implemented under the
          CW20 standard and it fully supports terraswap feature. Except any function of your token itself
          contains more than asset, we recommend to mint your own token by instantiating this binary, rather
          than developing your own.
        </Text>
        <Title id="mint">How to mint?</Title>
        <Text>
          Using the pre-stored binary (recommended) The standard CW20 token is already stored in Terra network
          as code ID 3. Please check
          <a href="https://docs.terraswap.io/docs/contract_resources/contract_addresses/">
            for more addresses.
          </a>
          You may instantiate your own token using the JSON as follows:
        </Text>
        <CopyBlock
          text={`	
          {
            "name":"your_token_name",
            "symbol":"SYMBOL",
            "decimals":3,
            "initial_balances":[
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
      `}
          language={"json"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>Then, the CLI reads:</Text>
        <CopyBlock
          text={`	
            terracli tx wasm instantiate <token_bin_code> '{"name": "your_token_name", "symbol": "SYMBOL", "decimals": 3, ... }' --from your_key
      `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>
          After confirmation, your token is minted on terra network! With your tx hash, you may query the tx:
        </Text>
        <CopyBlock
          text={`	
          terracli query tx EF2REFAWE234A2EFV....
      `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>Then, you may find the address of your contract from:</Text>
        <CopyBlock
          text={`	
          {
            "key": "contract_address",
            "value": "terra18vd8fpwxzck93qlwghaj6arh4p7c5n896xzem5"
          }      
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />

        <Text>
          Implement yourself – you find more details{" "}
          <a href="https://docs.terraswap.io/docs/howto/token/">here</a>
        </Text>
        <Title id="download">Downloading and compiling contracts</Title>
        <Text>
          In this section we will download a sample contract and compile it to wasm binary executable. Now, we
          will download the repo in which we collect{" "}
          <a href="https://github.com/CosmWasm/cw-examples">cw-examples</a>
          and try out a simple name service contract where mimics a name service marketplace. This is also
          de-facto cosmos – sdk entrance tutorial. First clone the repo, then try to build the wasm bundle:
        </Text>
        <CopyBlock
          text={`	
          # get the code
          git clone https://github.com/CosmWasm/cw-examples
          cd cw-examples
          git fetch --tags
          git checkout nameservice-0.11.0
          cd nameservice
          cargo wasm   
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>
          After compiles it should produce a file in:
          target/wasm32-unknown-unknown/release/cw_nameservice.wasm A quick <b>ls-lh</b> should show around
          1,7Mb. This is a release build, but not stripped of all unnecessary code. To produce a much smaller
          version, you can run this which tells the compiler to strip all unused code out:
        </Text>
        <CopyBlock
          text={`	
          RUSTFLAGS='-C link-arg=-s' cargo wasm
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>
          This produces a file about 162 kb. We use this and another optimizer (Optimize compilation section)
          to produce the final product uploaded to Tgrade. You don’t need to worry about running this yourself
          but you should have an idea of the final size of your contract, this way. You can also run Units
          Tests and Optimize Compilation – more details{" "}
          <a href="https://docs.cosmwasm.com/docs/0.16/getting-started/compile-contract">here</a>
        </Text>
        <Subtitle id="deploy">Deploying and Interacting</Subtitle>
        <Text>
          We generated a wasm binary executable, now let’s put it into use.
          <br />
          <b>Connecting to Testnet 2</b>
          <br />
          The following data is all we need to connect to tgrade-testnet-2:
          <br /> - <b>Staking, Fee token</b>: utgd
          <br /> - <b>Date Deployed</b>: 2021-08-27T12:00:01Z
          <br /> - <b>Chain ID</b>: tgrade-testnet-2
          <br /> - <b>in Fee</b>: 0.01utgd
          <br /> - <b>app</b>: tgrade
          <br /> - <b>version</b>: "v0.4.0-rc1" commit 4146b465a6576930504482c814922b90f23504ae
          <br />
          [RPC](https://rpc.testnet-2.tgrade.io) - public RPC endpoint
          <br />
          [LCD](https://lcd.testnet-2.tgrade.io) - public LCD endpoint
          <br />
          [FAUCET](https://faucet.testnet-2.tgrade.io) - faucet
          <br />
          [Aneka/BLOCKEXPLORER](https://testnet.tgrade.aneka.io) - block explorer
        </Text>
        <Subtitle id="upload">Uploading the contract</Subtitle>
        <Text>
          Now we will upload the code to Tgrade. Afterwards we can download the bytecode to verify if it is
          proper.
        </Text>
        <CopyBlock
          text={`	
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
          diff artifacts/cw_nameservice.wasm download.wasm          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Subtitle id="instantiating">Instantiating the contract</Subtitle>
        <Text>
          We can create an instance of this wasm contract. The verifier will find an escrow that will allow
          wallet to control payout and upon release the funds go to bob.
        </Text>
        <CopyBlock
          text={`	
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
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>Once contract instantiated let’s register a name and transfer it with paying its price.</Text>
        <CopyBlock
          text={`	
          NAME_QUERY='{"resolve_record": {"name": "fred"}}'
          tgrade query wasm contract-state smart $CONTRACT "$NAME_QUERY" $NODE --output json
          
          # {"data":{"address":"tgrade1um2e88neq8sxzuuem5ztt9d0em033rpr5ps9tv"}}
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Subtitle id="store">Storing a wasm contract to Tgrade chain</Subtitle>
        <Text>The storing command of a wasm contract</Text>
        <CopyBlock
          text={`	
          tgrade tx wasm store tgrade_dso.wasm --from bob --node https://rpc.testnet-2.tgrade.io --chain-id tgrade-testnet-2 --gas auto --gas-adjustment 1.3 --fee
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <br />
      </ContentWrapper>
    </PageWrapper>
  );
}
