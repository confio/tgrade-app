import { setSearchText, useTMarket } from "service/tmarket";

import StyledSearch from "./style";

export default function SearchToken({ placeholder }: { readonly placeholder: string }): JSX.Element {
  const {
    tMarketState: { searchText },
    tMarketDispatch,
  } = useTMarket();

  return (
    <StyledSearch
      placeholder={placeholder}
      allowClear
      value={searchText}
      onChange={({ target }) => setSearchText(tMarketDispatch, target.value)}
      style={{ width: "100%", borderRadius: "100%" }}
    />
  );
}
