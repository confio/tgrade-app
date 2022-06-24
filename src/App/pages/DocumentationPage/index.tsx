import { CopyBlock, monokai } from "react-code-blocks";
import { isMobile } from "react-device-detect";

import {
  ContentWrapper,
  PageWrapper,
  ReferenceList,
  RequirementList,
  StyledItemGroup,
  StyledMenu,
  StyledMenuItem,
  StyledSubmenu,
  Subtitle,
  Text,
  Title,
} from "./style";

export default function DocumentationPage(): JSX.Element | null {
  return (
    <PageWrapper>
      {isMobile ? null : (
        <StyledMenu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline">
          <StyledSubmenu key="sub1" icon={undefined} title="Introduction">
            <StyledItemGroup key="g1" title="Smart Contracts">
              <StyledMenuItem key="1">
                <a href="#requirements">Hardware Requirements</a>
              </StyledMenuItem>
              <StyledMenuItem key="2">
                <a href="#installation">Installation</a>
              </StyledMenuItem>
              <StyledMenuItem key="3">
                <a href="#environment">Setting Up the Environment</a>
              </StyledMenuItem>
              <StyledMenuItem key="4">
                <a href="#compiling">Optimizing the Compilation</a>
              </StyledMenuItem>
              <StyledMenuItem key="5">
                <a href="#uploading">Uploading and Verifying</a>
              </StyledMenuItem>
            </StyledItemGroup>
          </StyledSubmenu>
        </StyledMenu>
      )}
      <ContentWrapper isMobile={isMobile}>
        <Title id="requirements">Hardware Requirements</Title>
        <Text>For deploying smart contracts. We tested successfully with the following Architecture:</Text>
        <RequirementList>
          <li>Ubuntu 20.04 LTS</li>
          <li>go version 1.16.5 [1]</li>
          <li>Installed packages make and build-essential [2] [3]</li>
          <li>2 or more CPU cores Intel or AMD chipset</li>
          <li>At least 40GB of disk storage</li>
          <li>At least 4GB of memory (RAM)</li>
        </RequirementList>
        <ReferenceList>
          <li>
            <a href="https://github.com/golang/go/wiki/Ubuntu" target="_blank" rel="noopener noreferrer">
              https://github.com/golang/go/wiki/Ubuntu
            </a>
          </li>
          <li>
            <a href="https://packages.ubuntu.com/focal/make" target="_blank" rel="noopener noreferrer">
              https://packages.ubuntu.com/focal/make
            </a>
          </li>
          <li>
            <a
              href="https://packages.ubuntu.com/focal/build-essential"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://packages.ubuntu.com/focal/build-essential
            </a>
          </li>
        </ReferenceList>
        <Text>
          You can use a physical infrastructure (baremetal) or wellknown cloud providers like: DigitalOcean,
          AWS, Google Cloud Platform, among others
        </Text>
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
# Get wasmd v0.18,0 ( that is the version we verified and tested)
wget https://github.com/CosmWasm/wasmd/archive/refs/tags/v0.18.0.tar.gz
tar xzvf v0.18.0.tar.gz
cd wasmd-0.18.0
  
# Run GO install for the upcoming binary,
# all those optional flags will make wasmd available to run tgrade addresses
go install -mod=readonly -ldflags \\
    "-X github.com/cosmos/cosmos-sdk/version.Name=tgrade \\
    -X github.com/cosmos/cosmos-sdk/version.AppName=tgrade \\
    -X github.com/CosmWasm/wasmd/app.Bech32Prefix=tgrade" \\
    ./cmd/wasmd
  
# Build the binary
go build -mod=readonly -ldflags \\
    "-X github.com/cosmos/cosmos-sdk/version.Name=tgrade \\
    -X github.com/cosmos/cosmos-sdk/version.AppName=tgrade \\
    -X github.com/CosmWasm/wasmd/app.Bech32Prefix=tgrade" \\
    -o build/wasmd ./cmd/wasmd
  
# Move the binary to an executable path
sudo mv build/wasmd /usr/local/bin

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
          text={`source <(curl -sSL https://gist.githubusercontent.com/orkunkl/773e1798dc04ac7d06f468a778e90db6/raw/747290af38420138c1179ec3ce7d89f28e3accca/testnet-2_defaults.env)`}
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
          text={`JSON=$(jq -n --arg addr $(wasmd keys show -a wallet) '{"denom":"utgd","address":$addr}') && curl -X POST --header "Content-Type: application/json" --data "$JSON" https://faucet.testnet-2.tgrade.io/credit`}
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
          text={`wasmd query bank total $NODE`}
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
docker run --rm -v "$(pwd)":/code \\
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \\
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \\
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
