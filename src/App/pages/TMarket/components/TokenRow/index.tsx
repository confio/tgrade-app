import { Col, Row } from "antd";
import MaxButton from "App/components/MaxButton";
import { lazy, useState } from "react";
import { setSearchText, useTMarket } from "service/tmarket";
import { useTokens } from "service/tokens";
import { TokenRowProps } from "utils/tokens";

import SelectTokenTrigger from "../SelectTokenTrigger";
import {
  BalanceParagraph,
  ErrorContainer,
  MaxContainer,
  StyledInput,
  TitleParagraph,
  TokenContainer,
} from "./style";

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
  tokenFilter,
  onChange,
  disabledInput,
}: TokenRowProps): JSX.Element {
  const {
    tokensState: { tokens },
  } = useTokens();
  const { tMarketDispatch } = useTMarket();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const balance = token ? tokens.get(token.address)?.humanBalance : "0";

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
            <Col style={{ display: "flex", justifyContent: "flex-end" }} span={10}>
              <StyledInput
                style={{ width: "100%" }}
                onChange={onChange}
                decimalSeparator=","
                formatter={(value) => {
                  if (!value) return "";
                  const replacedComma = String(value).replace(",", ".");
                  return replacedComma;
                }}
                parser={(displayValue) => {
                  if (!displayValue) return "";
                  const replacedComma = displayValue.replace(",", ".");
                  return replacedComma;
                }}
                placeholder="1.0"
                defaultValue=""
                bordered={false}
                size="large"
                name={id || title}
                disabled={disabledInput}
              />
            </Col>
          </Row>
        </Col>
        <SelectTokenModal
          isModalOpen={isModalOpen}
          closeModal={() => {
            setIsModalOpen(false);
            setSearchText(tMarketDispatch, "");
          }}
          setToken={setToken}
          tokenFilter={tokenFilter}
        />
      </TokenContainer>
      {error ? <ErrorContainer>{error}</ErrorContainer> : null}
    </div>
  );
}

export default TokenRow;
