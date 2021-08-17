import React from "react";
import { Row, Col } from "antd";
import Input from "./style";
import { TokenRowProps } from "utils/tokens";
import { BalanceParagraph, TitleParagraph, TokenContainer, ErrorContainer } from "./style";
import SelectTokenTrigger from "../SelectTokenTrigger";
import SelectTokenModal from "../SelecTokenModal";

export const EmptyCol = (): JSX.Element => <Col>&nbsp;</Col>;

function TokenRowWithdraw({
  title,
  id,
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

            {/* <MaxContainer span={4}>
              {(maxButton || onMaxClick) && <MaxButton onClick={onMaxClick}>MAX</MaxButton>}
            </MaxContainer> */}
            <Col offset={4} span={20}>
              <Input
                disabled={true}
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

export default TokenRowWithdraw;
