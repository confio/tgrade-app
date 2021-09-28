import { Col, Row } from "antd";
import InputNumber from "App/components/InputNumber";
import MaxButton from "App/components/MaxButton";
import { lazy, useState } from "react";
import { TokenRowProps } from "utils/tokens";
import SelectTokenTrigger from "../SelectTokenTrigger";
import { BalanceParagraph, ErrorContainer, MaxContainer, TitleParagraph, TokenContainer } from "./style";

const SelectTokenModal = lazy(() => import("../SelecTokenModal"));

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
