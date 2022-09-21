import { Row, Typography } from "antd";
import { MouseEventHandler } from "react";
import { TokenHuman } from "utils/tokens";

import arrowDownIcon from "./assets/arrow-down-icon.svg";
import StyledSelectTokenButton, { Image, SelectTokenParagraph } from "./style";
const { Paragraph } = Typography;
const SelectTokenTrigger = ({
  Token,
  openModal,
}: {
  Token: TokenHuman | undefined;
  openModal: MouseEventHandler<HTMLButtonElement>;
}): JSX.Element => {
  return (
    <StyledSelectTokenButton onClick={openModal}>
      {!Token ? (
        <Row style={{ width: "100%", columnGap: "10px" }}>
          <SelectTokenParagraph>Select a token</SelectTokenParagraph>
          <img src={arrowDownIcon} alt="Down arrow select token" />
        </Row>
      ) : (
        <>
          <Image src={Token.img} alt={Token.name} />
          <Paragraph>{Token.symbol}</Paragraph>
        </>
      )}
    </StyledSelectTokenButton>
  );
};

export default SelectTokenTrigger;
