import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-token-round.svg";

import { ItemWrapper } from "./style";

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
        <span style={{ marginLeft: "25px" }}>
          {value} {title}
        </span>
      </div>
      <span>&#8776; ${price}</span>
    </ItemWrapper>
  );
}
