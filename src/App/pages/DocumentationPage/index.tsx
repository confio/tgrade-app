import { StyledMenu, StyledSubmenu, StyledItemGroup, StyledMenuItem } from "./style";
export default function DocumentationPage(): JSX.Element | null {
  return (
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
  );
}
