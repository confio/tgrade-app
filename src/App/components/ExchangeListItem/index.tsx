import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-token-round.svg";

import { AmountText, ItemWrapper, SymbolText, ValueText } from "./style";

interface itemProps {
  icon: string;
  title: string;
  value: number;
  price: number;
}

export default function ExchangeListItem({ icon, value, title, price }: itemProps): JSX.Element | null {
  return (
    <ItemWrapper
      onClick={() => {
        alert(`clicked ${title}`);
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <TgradeLogo style={{ width: "25px" }} />
        <AmountText style={{ marginLeft: "10px" }}>{value}</AmountText>
        <SymbolText>{title}</SymbolText>
      </div>
      <ValueText>&#8776; €{price}</ValueText>
    </ItemWrapper>
  );
}
