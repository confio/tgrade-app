import { Divider, Typography } from "antd";
import Stack from "App/components/Stack/style";
import { useState } from "react";

import backIcon from "./assets/arrow-back-icon.svg";
import closeIcon from "./assets/cross.svg";
import AllTokens from "./components/AllTokens";
import PinnedTokens from "./components/PinnedTokens";
import Search from "./components/SearchToken";
import TokenDetail from "./components/TokenDetail";
import StyledSelectTokenModal, { ModalHeader, SelectTokensMenu } from "./style";

interface SelectTokenModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly setToken: any;
  readonly tokenFilter: "exclude-lp" | "lp-only";
}
const { Title } = Typography;

export default function SelectTokenModal({
  isModalOpen,
  closeModal,
  setToken,
  tokenFilter,
}: SelectTokenModalProps): JSX.Element {
  const [currentTab, setCurrentTab] = useState<"pinned" | "detail" | "all">("pinned");

  return (
    <StyledSelectTokenModal
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
      width="100%"
      bgTransparent={true}
      style={{
        left: "calc(15.25rem / 2)",
        right: "40px",
        padding: "var(--s4) 0",
        maxWidth: "738px",
      }}
      bodyStyle={{
        maxWidth: "738px",
        position: "relative",
        padding: "var(--s1)",
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{ background: "rgba(4,119,120,0.6)" }}
    >
      <ModalHeader>
        <img src={backIcon} alt="Go back" onClick={closeModal} />
        <Title>Select a token</Title>
        <img className="exit" alt="Close button" src={closeIcon} onClick={closeModal} />
      </ModalHeader>
      <Divider />
      <Stack gap="s-1">
        <SelectTokensMenu
          onClick={({ key }) => setCurrentTab(key as "pinned" | "detail" | "all")}
          selectedKeys={[currentTab]}
          mode="horizontal"
        >
          <SelectTokensMenu.Item key="pinned">Pinned tokens</SelectTokensMenu.Item>
          <SelectTokensMenu.Item key="detail">Token detail</SelectTokensMenu.Item>
          <SelectTokensMenu.Item key="all">All tokens</SelectTokensMenu.Item>
        </SelectTokensMenu>
        <Search />
      </Stack>
      <Divider style={{ margin: "5px 0" }} />
      <Stack gap="s0">
        {currentTab === "pinned" ? (
          <PinnedTokens setToken={setToken} closeModal={closeModal} tokenFilter={tokenFilter} />
        ) : null}
        {currentTab === "detail" ? <TokenDetail setToken={setToken} closeModal={closeModal} /> : null}
        {currentTab === "all" ? (
          <AllTokens setToken={setToken} closeModal={closeModal} tokenFilter={tokenFilter} />
        ) : null}
      </Stack>
    </StyledSelectTokenModal>
  );
}
