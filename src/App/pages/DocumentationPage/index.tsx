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
      </ContentWrapper>
    </PageWrapper>
  );
}
