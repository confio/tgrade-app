import { Divider, Typography } from "antd";
import Stack from "App/components/layoutPrimitives/Stack/component";
import { TokenProps } from "utils/tokens";
import modalBg from "./assets/modal-background.jpg";
import Search from "./components/SearchToken";
import closeIcon from "./assets/cross.svg";
import StyledSelectTokenModal, { ModalHeader } from "./style";
import backIcon from "./assets/arrow-back-icon.svg";
import SelectTokenFilters from "./components/SelectTokenFilters";
import ListTokens from "./components/ListTokens";

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
        padding: "var(--s4) 0",
        maxWidth: "calc(554px + 15px)",
      }}
      bodyStyle={{
        maxWidth: "554px",
        position: "relative",
        padding: "var(--s1)",
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{
        background: `linear-gradient(0deg, rgba(4, 119, 120, 0.9), rgba(4, 119, 120, 0.9)), url(${modalBg})`,
        backgroundSize: "cover",
      }}
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
        <ListTokens tokens={tokens} closeModal={closeModal} setToken={setToken} />
      </Stack>
    </StyledSelectTokenModal>
  );
}
