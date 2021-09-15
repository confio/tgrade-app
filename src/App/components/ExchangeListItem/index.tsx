import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-token-round.svg";

import { AmountText, ItemWrapper, SymbolText, ValueText } from "./style";

interface itemProps {
  address: string;
  balance: string;
  humanBalance: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: string;
  img?: string;
}

export default function ExchangeListItem({
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
    <ItemWrapper onClick={() => {}}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TgradeLogo style={{ width: "25px" }} />
        <AmountText style={{ marginLeft: "10px" }}>{humanBalance}</AmountText>
        <SymbolText>{name}</SymbolText>
      </div>
    </ItemWrapper>
  );
}

//TODO add price <ValueText>&#8776; €{price}</ValueText>
