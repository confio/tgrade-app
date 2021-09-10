import Button from "App/components/Button";
import { useHistory } from "react-router";
import ExchangeList from "App/components/ExchangeList";
import { paths } from "App/paths";
import { ItemWrapper } from "App/components/ExchangeListItem/style";

export default function ExchangeContainer(): JSX.Element | null {
  const history = useHistory();

  function handleClick() {
    history.push(`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`);
  }
  return (
    <div>
      <ExchangeList />
      <ItemWrapper style={{ justifyContent: "flex-end", margin: "0px" }}>
        <Button onClick={handleClick} style={{ height: "42px", alignItems: "center" }}>
          Exchange
        </Button>
      </ItemWrapper>
    </div>
  );
}
