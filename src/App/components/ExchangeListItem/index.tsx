import { ReactComponent as TgradeLogo } from "App/assets/icons/tgradeLogo.svg";

import { ItemWrapper } from "./style";

interface itemProps {
  icon: string;
  title: string;
  value: number;
  price: number;
}

export default function ExchangeListItem({ icon, value, title, price }: itemProps): JSX.Element | null {
  return (
    <div>
      <ItemWrapper>
        <div>
          <TgradeLogo style={{ width: "20px" }} />
          <div style={{ marginLeft: "10px" }}>
            <span>{value}</span>
            <span>{title}</span>
          </div>
        </div>
        <span>${price}</span>
      </ItemWrapper>
    </div>
  );
}
