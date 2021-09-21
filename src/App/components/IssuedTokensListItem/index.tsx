import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-token-round.svg";
import { ItemWrapper, Title } from "./style";

interface itemProps extends React.HTMLAttributes<HTMLDivElement> {
  address: string;
  balance: string;
  humanBalance: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: string;
  img?: string;
}

export default function IssueTokensListItem({
  address,
  balance,
  humanBalance,
  decimals,
  name,
  symbol,
  totalSupply,
  img,
}: itemProps): JSX.Element | null {
  return (
    <ItemWrapper>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TgradeLogo style={{ width: "25px" }} />

        <Title style={{ marginLeft: "8px" }}>
          {name} ({symbol})
        </Title>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <span>{humanBalance}</span>
      </div>
    </ItemWrapper>
  );
}
