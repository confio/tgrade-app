import Button from "App/components/Button";
import ExchangeList from "App/components/ExchangeList";

export default function ExchangeContainer(): JSX.Element | null {
  return (
    <div>
      <ExchangeList />
      <Button style={{ height: "42px", margin: "5px", alignItems: "center", float: "right" }}>
        Exchange
      </Button>
    </div>
  );
}
