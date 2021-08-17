import React from "react";
import { Row, Col } from "antd";
import { TokenRowProps } from "utils/tokens";
import MaxButton from "App/components/MaxButton";
import InputNumber from "App/components/InputNumber";
import { BalanceParagraph, TitleParagraph, TokenContainer, MaxContainer, ErrorContainer } from "./style";
import SelectTokenTrigger from "../SelectTokenTrigger";
import SelectTokenModal from "../SelecTokenModal";

export const EmptyCol = (): JSX.Element => <Col>&nbsp;</Col>;

function TokenRow({
  title,
  id,
  onMaxClick,
  maxButton,
  position,
  token,
  setToken,
  hideSelectToken,
  error,
  tokens,
  onChange,
}: TokenRowProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const balance = token?.humanBalance ? token?.humanBalance : "0";

  return (
    <div>
      <TokenContainer className={`position${position} ${error ? "error" : ""}`}>
        <Col span={24}>
          <Row>
            <Col span={12}>
              <TitleParagraph>{title}</TitleParagraph>
            </Col>
            <Col span={12}>
              <BalanceParagraph>Balance : {balance}</BalanceParagraph>
            </Col>
          </Row>
          <Row gutter={16}>
            {hideSelectToken ? null : (
              <Col span={10}>
                <SelectTokenTrigger Token={token} openModal={() => setIsModalOpen(true)} />
              </Col>
            )}

            <MaxContainer span={4}>
              {(maxButton || onMaxClick) && <MaxButton onClick={onMaxClick}>MAX</MaxButton>}
            </MaxContainer>
            <Col span={10}>
              <InputNumber
                onChange={onChange}
                placeholder="0.0"
                bordered={false}
                size="large"
                name={id || title}
              />
            </Col>
          </Row>
        </Col>
        <SelectTokenModal
          tokens={tokens}
          closeModal={() => {
            setIsModalOpen(false);
          }}
          isModalOpen={isModalOpen}
          setToken={setToken}
        />
      </TokenContainer>
      {error ? <ErrorContainer>{error}</ErrorContainer> : null}
    </div>
  );
}

export default TokenRow;
