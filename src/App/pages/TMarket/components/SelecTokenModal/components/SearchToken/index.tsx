import { setSearchText, useTMarket } from "service/tmarket";

import StyledSearch from "./style";

export default function SearchToken(props: any): JSX.Element {
  const { tMarketDispatch } = useTMarket();
  const onSearch = (value: string) => setSearchText(tMarketDispatch, value);

  return (
    <StyledSearch
      placeholder="Search token or trusted circle name"
      allowClear
      onChange={({ target }) => onSearch(target.value)}
      style={{ width: "100%", borderRadius: "100%" }}
    />
  );
}
