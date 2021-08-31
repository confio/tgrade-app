import IssueTokensListItem from "../IssuedTokensListItem";
//import { MockData } from "./__mocks__/mockData";
import { TokenProps } from "utils/tokens";

export default function IssuedTokensList(props: { tokens: TokenProps[] }): JSX.Element | null {
  return (
    <ul style={{ width: "100%", listStyle: "none", paddingLeft: "0" }}>
      {props.tokens.map((token) => (
        <IssueTokensListItem
          key={token.address}
          icon={token.img}
          title={token.name}
          price={Number(token.humanBalance)}
          change={Number(token.total_supply)}
          dso={token.symbol}
        ></IssueTokensListItem>
      ))}
    </ul>
  );
}
