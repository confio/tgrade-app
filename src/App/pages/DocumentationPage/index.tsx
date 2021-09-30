import { useEffect, useState } from "react";
import {
  StyledMenu,
  StyledSubmenu,
  StyledItemGroup,
  StyledMenuItem,
  PageWrapper,
  ContentWrapper,
  StyledReactMarkdown,
} from "./style";
import remarkGfm from "remark-gfm";

export default function DocumentationPage(): JSX.Element | null {
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
        <StyledReactMarkdown children={postMarkdown} remarkPlugins={[remarkGfm]} />
      </ContentWrapper>
    </PageWrapper>
  );
}
