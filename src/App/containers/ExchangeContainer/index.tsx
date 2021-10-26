import Button from "App/components/Button";
import ExchangeList from "App/components/ExchangeList";
import { ItemWrapper } from "App/components/ExchangeListItem/style";
import { getTokensList } from "App/pages/TMarket/utils";
import { paths } from "App/paths";
import { useHistory } from "react-router";
import { useTMarket } from "service/tmarket";
import { TokenProps } from "utils/tokens";

export default function ExchangeContainer(): JSX.Element | null {
  const history = useHistory();
  const { tMarketState } = useTMarket();
  const tokens: TokenProps[] = getTokensList(tMarketState.tokens, "");

  function handleClick() {
    history.push(`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`);
  }
  return (
    <div>
      <ExchangeList tokens={tokens} />
      <ItemWrapper style={{ justifyContent: "flex-end", margin: "0px" }}>
        <Button onClick={handleClick} style={{ height: "42px", alignItems: "center" }}>
          Exchange
        </Button>
      </ItemWrapper>
    </div>
  );
}
