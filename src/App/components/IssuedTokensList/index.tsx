import InfiniteScroll from "react-infinite-scroll-component";
import { TokenProps } from "utils/tokens";

import IssueTokensListItem from "../IssuedTokensListItem";

export default function IssuedTokensList(props: { tokens: TokenProps[] }): JSX.Element | null {
  return (
    <InfiniteScroll
      dataLength={props.tokens.length}
      next={() => null}
      hasMore={false}
      loader={<h4>Loading...</h4>}
      height={300}
      endMessage={undefined}
    >
      {props.tokens.map((token) => (
        <IssueTokensListItem
          key={token.address}
          img={token.img}
          name={token.name}
          balance={token.balance}
          humanBalance={token.humanBalance}
          totalSupply={token.total_supply}
          symbol={token.symbol}
          address={token.address}
          decimals={token.decimals}
        ></IssueTokensListItem>
      ))}
    </InfiniteScroll>
  );
}
