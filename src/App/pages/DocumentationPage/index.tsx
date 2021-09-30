import { useEffect, useState } from "react";
import { StyledMenu, StyledSubmenu, StyledItemGroup, StyledMenuItem, PageWrapper } from "./style";
import Markdown from "markdown-to-jsx";

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
            <StyledMenuItem key="1">Your First Contract</StyledMenuItem>
            <StyledMenuItem key="2">Installation</StyledMenuItem>
            <StyledMenuItem key="3">Setting up Environment</StyledMenuItem>
          </StyledItemGroup>
        </StyledSubmenu>
        <StyledSubmenu key="sub2" icon={undefined} title="Nodes"></StyledSubmenu>
      </StyledMenu>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          marginLeft: "245px",
          padding: "200px",
        }}
      >
        <Markdown>{postMarkdown}</Markdown>
      </div>
    </PageWrapper>
  );
}
