import { CopyBlock, monokai } from "react-code-blocks";
import {
  ContentWrapper,
  PageWrapper,
  StyledItemGroup,
  StyledMenu,
  StyledMenuItem,
  StyledSubmenu,
  Subtitle,
  Text,
  Title,
} from "./style";

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
              <a href="#environment">Setting Up the Environment</a>
            </StyledMenuItem>
            <StyledMenuItem key="3">
              <a href="#compiling">Optimizing the Compilation</a>
            </StyledMenuItem>
            <StyledMenuItem key="4">
              <a href="#uploading">Uploading and Verifying</a>
            </StyledMenuItem>
          </StyledItemGroup>
        </StyledSubmenu>
      </StyledMenu>
      <ContentWrapper>
        <Title id="installation">Installation</Title>
        <Text>
          In this section, we will gear up your workhorse for developing, deploying and, enjoying smart
          contracts on Tgrade network.
        </Text>
        <Subtitle>Go</Subtitle>
        <Text>
          You can setup golang following{" "}
          <a
            href="https://github.com/golang/go/wiki#working-with-go"
            target="_blank"
            rel="noopener noreferrer"
          >
            official documentation
          </a>
          . The latest versions of wasmd require go version v1.15.
        </Text>
        <Subtitle>Rust</Subtitle>
        <Text>
          Assuming you have never worked with rust, you will first need to install some tooling. The standard
          approach is to use rustup to maintain dependencies and handle updating multiple versions of cargo
          and rustc, which you will be using.
        </Text>
        <Subtitle>Installing Rust</Subtitle>
        <Text>
          First,{" "}
          <a href="https://rustup.rs/" target="_blank" rel="noopener noreferrer">
            install rustup
          </a>
          . Once installed, make sure you have the wasm32 target:
        </Text>
        <CopyBlock
          text={`
  rustup default stable
  cargo version
  rustup update stable

  rustup target list --installed
  rustup target add wasm32-unknown-unknown
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Subtitle>wasmd</Subtitle>
        <Text>
          wasmd is the backbone of CosmWasm platform. It is both blockchain node and interaction client. It is
          the implementation of a Cosmos zone with wasm smart contracts enabled.
        </Text>
        <Text>
          tgrade binary that will be released is a modified version of wasmd. For deployment and interaction,
          we will use wasmd for now.
        </Text>
        <CopyBlock
          text={`
  git clone https://github.com/CosmWasm/wasmd.git
  cd wasmd
  # replace the v0.18.0 with the most stable version on https://github.com/CosmWasm/wasmd/releases
  git checkout v0.18.0
  make install

  go install -mod=readonly
    -ldflags "-X github.com/cosmos/cosmos-sdk/version.Name=tgrade -X github.com/CosmWasm/wasmd/app.Bech32Prefix=tgrade"
    ./cmd/wasmd

  # verify the installation
  wasmd version
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Title id="environment">Setting Up the Environment</Title>
        <Text>
          You need an environment to run contracts. You can either run your node locally or connect to an
          existing network. For easy testing, testnet-2 network is online, you can use it to deploy and run
          your contracts.
        </Text>
        <Text>
          RPC -{" "}
          <a href="https://rpc.testnet-2.tgrade.io" target="_blank" rel="noopener noreferrer">
            https://rpc.testnet-2.tgrade.io
          </a>
        </Text>
        <Text>
          LCD -{" "}
          <a href="https://lcd.testnet-2.tgrade.io" target="_blank" rel="noopener noreferrer">
            https://lcd.testnet-2.tgrade.io
          </a>
        </Text>
        <Text>
          Faucet -{" "}
          <a href="https://faucet.testnet-2.tgrade.io" target="_blank" rel="noopener noreferrer">
            https://faucet.testnet-2.tgrade.io
          </a>
        </Text>
        <Text>
          Block explorer -{" "}
          <a href="https://testnet.tgrade.aneka.io" target="_blank" rel="noopener noreferrer">
            https://testnet.tgrade.aneka.io
          </a>
        </Text>
        <Subtitle>Setup Go CLI</Subtitle>
        <Text>
          Let's configure wasmd exec, point it to testnets, create wallet and ask tokens from faucet:
        </Text>
        <Text>First, source the testnet-2 network configurations to the shell:</Text>
        <CopyBlock
          text={`  source <(curl -sSL https://gist.githubusercontent.com/orkunkl/773e1798dc04ac7d06f468a778e90db6/raw/747290af38420138c1179ec3ce7d89f28e3accca/testnet-2_defaults.env)`}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>Setup the client:</Text>
        <CopyBlock
          text={`
  # add wallets for testing
  wasmd keys add wallet
  >
  {
    "name": "wallet",
    "type": "local",
    "address": "tgrade13nt9rxj7v2ly096hm8qsyfjzg5pr7vn5saqd50",
    "pubkey": "tgradepub1addwnpepqf4n9afaefugnfztg7udk50duwr4n8p7pwcjlm9tuumtlux5vud6qvfgp9g",
    "mnemonic": "hobby bunker rotate piano satoshi planet network verify else market spring toward pledge turkey tip slim word jaguar congress thumb flag project chalk inspire"
  }
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>You need some tokens in your address to interact. Requesting tokens from faucet:</Text>
        <CopyBlock
          text={`  JSON=$(jq -n --arg addr $(wasmd keys show -a wallet) '{"denom":"utgd","address":$addr}') && curl -X POST --header "Content-Type: application/json" --data "$JSON" https://faucet.testnet-2.tgrade.io/credit`}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Subtitle>Export wasmd Parameters</Subtitle>
        <Text>Export wasmd variables for setting up node endpoint and transaction configuration:</Text>
        <CopyBlock
          text={`
  # bash
  export NODE="--node $RPC"
  export TXFLAG="\${NODE} --chain-id \${CHAIN_ID} --gas-prices 0.001utgd --gas auto --gas-adjustment 1.3"

  # zsh
  export NODE=(--node $RPC)
  export TXFLAG=($NODE --chain-id $CHAIN_ID --gas-prices 0.001utgd --gas auto --gas-adjustment 1.3)
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>
          If command above throws error, this means your shell is different. If no errors, try running this:
        </Text>
        <CopyBlock
          text={`  wasmd query bank total $NODE`}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Title id="compiling">Optimizing the Compilation</Title>
        <Text>
          After compiling your contract with cargo, the optimized compilation process will provide a binary
          ready to be deployed on a network. Smart contract binary size must be as small as possible for
          reduced gas cost. This will not only cost less on deployment, also for every single interaction.
          Simply, optimize production code using{" "}
          <a href="https://github.com/CosmWasm/rust-optimizer" target="_blank" rel="noopener noreferrer">
            cosmwasm/rust-optimizer
          </a>
          . rust-optimizer also produces reproducible builds of smart contracts. This means third parties can
          verify the contract is actually the claimed code.
        </Text>
        <CopyBlock
          text={`
  docker run --rm -v "$(pwd)":/code
    --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target
    --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry
    cosmwasm/rust-optimizer:0.11.5
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
        <Text>Binary will be at artifacts.</Text>
        <Title id="uploading">Uploading and Verifying</Title>
        <Text>
          After generating a wasm binary executable, we can put it into use. Now, we will upload the code to
          the blockchain. Afterwards, you can download the bytecode to verify it is proper:
        </Text>
        <CopyBlock
          text={`
  # see how many codes we have now
  wasmd query wasm list-code $NODE

  # gas is huge due to wasm size... but auto-zipping reduced this from 1.8M to around 600k
  # you can see the code in the result
  RES=$(wasmd tx wasm store artifacts/mycontract.wasm --from wallet $TXFLAG -y)

  # you can also get the code this way
  CODE_ID=$(echo $RES | jq -r '.logs[0].events[-1].attributes[0].value')

  # no contracts yet, this should return an empty list
  wasmd query wasm list-contract-by-code $CODE_ID $NODE --output json

  # you can also download the wasm from the chain and check that the diff between them is empty
  wasmd query wasm code $CODE_ID $NODE download.wasm
  diff artifacts/mycontract.wasm download.wasm
          `}
          language={"shell"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
