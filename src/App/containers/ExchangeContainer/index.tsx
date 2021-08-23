import Button from "App/components/Button";
import { useHistory } from "react-router";
import ExchangeList from "App/components/ExchangeList";
import { paths } from "App/paths";

export default function ExchangeContainer(): JSX.Element | null {
  const history = useHistory();

  function handleClick() {
    history.push(`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`);
  }
  return (
    <div>
      <ExchangeList />
      <Button
        onClick={handleClick}
        style={{ height: "42px", margin: "5px", alignItems: "center", float: "right" }}
      >
        Exchange
      </Button>
    </div>
  );
}
