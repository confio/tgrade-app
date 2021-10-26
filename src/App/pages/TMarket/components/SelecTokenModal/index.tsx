import { Divider, Typography } from "antd";
import Stack from "App/components/Stack/style";
import { TokenProps } from "utils/tokens";

import backIcon from "./assets/arrow-back-icon.svg";
import closeIcon from "./assets/cross.svg";
import ListTokens from "./components/ListTokens";
import Search from "./components/SearchToken";
import SelectTokenFilters from "./components/SelectTokenFilters";
import StyledSelectTokenModal, { ModalHeader } from "./style";

interface SelectTokenModalProps {
  readonly isModalOpen: boolean;
  readonly tokens: Array<TokenProps>;
  readonly closeModal: () => void;
  readonly setToken: any;
}
const { Title } = Typography;

export default function SelectTokenModal({
  isModalOpen,
  closeModal,
  setToken,
  tokens,
}: SelectTokenModalProps): JSX.Element {
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
        <Search />
        <SelectTokenFilters />
      </Stack>
      <Divider style={{ margin: "5px 0" }} />
      <Stack gap="s0">
        <ListTokens closeModal={closeModal} setToken={setToken} />
      </Stack>
    </StyledSelectTokenModal>
  );
}
