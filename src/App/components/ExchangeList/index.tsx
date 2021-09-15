import ExchangeListItem from "App/components/ExchangeListItem";
import { TokenProps } from "utils/tokens";

export default function ExchangeList(props: { tokens: TokenProps[] }): JSX.Element | null {
  return (
    <ul style={{ width: "100%", listStyle: "none", paddingLeft: "0" }}>
      {props.tokens.map((token) => (
        <ExchangeListItem
          key={token.address}
          img={token.img}
          name={token.name}
          balance={token.balance}
          humanBalance={token.humanBalance}
          totalSupply={token.total_supply}
          symbol={token.symbol}
          address={token.address}
          decimals={token.decimals}
        ></ExchangeListItem>
      ))}
    </ul>
  );
}
