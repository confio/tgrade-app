import ExchangeListItem from "App/components/ExchangeListItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { TokenProps } from "utils/tokens";

export default function ExchangeList(props: { tokens: TokenProps[] }): JSX.Element | null {
  const filteredTokens = props.tokens.filter((token) => token.humanBalance !== "0");
  return (
    <InfiniteScroll
      dataLength={props.tokens.length}
      next={() => null}
      hasMore={false}
      loader={<h4>Loading...</h4>}
      height={300}
      endMessage={undefined}
    >
      {filteredTokens.map((token) => (
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
    </InfiniteScroll>
  );
}
