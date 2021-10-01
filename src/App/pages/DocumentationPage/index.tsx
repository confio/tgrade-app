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
  Code,
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
      <StyledMenu onClick={() => null} defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline">
        <StyledSubmenu key="sub1" icon={undefined} title="Introduction">
          <StyledItemGroup key="g1" title="Smart Contracts">
            <StyledMenuItem key="1">Technical Guide - Creating d’Apps for a Syndicated loans</StyledMenuItem>
            <StyledMenuItem key="2">Installation</StyledMenuItem>
            <StyledMenuItem key="3">Setting up Environment</StyledMenuItem>
            <StyledMenuItem key="4">The Test Net</StyledMenuItem>
            <StyledMenuItem key="5">User create a trusted circle DSO</StyledMenuItem>
            <StyledMenuItem key="6">Setup Command Line Interface – CLI</StyledMenuItem>
            <StyledMenuItem key="7">CW20 token</StyledMenuItem>
            <StyledMenuItem key="8">How to mint?</StyledMenuItem>
            <StyledMenuItem key="9">Downloading and compiling contracts</StyledMenuItem>
            <StyledMenuItem key="10">User create a trusted circle DSO</StyledMenuItem>
            <StyledMenuItem key="11">Setup Command Line Interface – CLI</StyledMenuItem>
            <StyledMenuItem key="12">CW20 token</StyledMenuItem>
          </StyledItemGroup>
        </StyledSubmenu>
        <StyledSubmenu key="sub2" icon={undefined} title="Deploying and Interacting">
          <StyledItemGroup key="g1" title="Smart Contracts">
            <StyledMenuItem key="1">Technical Guide - Creating d’Apps for a Syndicated loans</StyledMenuItem>
            <StyledMenuItem key="2">Installation</StyledMenuItem>
            <StyledMenuItem key="3">Setting up Environment</StyledMenuItem>
            <StyledMenuItem key="4">The Test Net</StyledMenuItem>
            <StyledMenuItem key="5">User create a trusted circle DSO</StyledMenuItem>
            <StyledMenuItem key="6">Setup Command Line Interface – CLI</StyledMenuItem>
            <StyledMenuItem key="7">CW20 token</StyledMenuItem>
            <StyledMenuItem key="8">How to mint?</StyledMenuItem>
            <StyledMenuItem key="9">Downloading and compiling contracts</StyledMenuItem>
            <StyledMenuItem key="10">User create a trusted circle DSO</StyledMenuItem>
            <StyledMenuItem key="11">Setup Command Line Interface – CLI</StyledMenuItem>
            <StyledMenuItem key="12">CW20 token</StyledMenuItem>
          </StyledItemGroup>
        </StyledSubmenu>
      </StyledMenu>
      <ContentWrapper>
        <Title>Technical Guide - Creating d’Apps for a Syndicated loans</Title>
        <Subtitle>
          Syndicated loan d’Apps deployed to Tgrade network and exchangeable on a marketplace
        </Subtitle>
        <Title>Installation</Title>
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
        <Title>Setting up the environment</Title>
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
        <Subtitle>User create a trusted circle (DSO)</Subtitle>
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
        <Subtitle>Setup Command Line Interface – CLI</Subtitle>
        <Text>
          Let's configure wasmd exec, point it to test net, create wallet and ask tokens from faucet:
          <br />-<b>First, source the Oysternet network configurations to the shell:</b>
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
      </ContentWrapper>
    </PageWrapper>
  );
}
