import { Radio, Row } from "antd";
import { StyledRadioGroup } from "./style";
import { useEffect, useState } from "react";
import { setTokensFilter, TokensFilter, useTMarket } from "service/tmarket";

const SelectTokenFilters = (): JSX.Element => {
  const { tMarketDispatch } = useTMarket();
  const [filter, setFilter] = useState<TokensFilter>("whitelist");

  useEffect(() => {
    setTokensFilter(tMarketDispatch, filter);
  }, [filter, tMarketDispatch]);

  return (
    <Row>
      <StyledRadioGroup
        onChange={({ target }) => {
          setFilter(target.value);
        }}
        value={filter}
      >
        <Radio value="whitelist">Show with balance</Radio>
        <Radio value="all">Show all</Radio>
      </StyledRadioGroup>
    </Row>
  );
};
export default SelectTokenFilters;
