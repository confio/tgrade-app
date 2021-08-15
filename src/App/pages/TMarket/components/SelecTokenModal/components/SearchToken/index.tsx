import { useTMarket, setSearchText } from "service/tmarket";
import StyledSearch from "./style";

export default function SearchToken(props: any): JSX.Element {
  const { tMarketDispatch } = useTMarket();
  const onSearch = (value: string) => setSearchText(tMarketDispatch, value);

  return (
    <StyledSearch
      placeholder="Search token or trusted circle name"
      allowClear
      onSearch={onSearch}
      style={{ width: "100%", borderRadius: "100%" }}
    />
  );
}
