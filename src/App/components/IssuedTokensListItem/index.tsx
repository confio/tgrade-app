import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-token-round.svg";
import { ItemWrapper } from "./style";

interface itemProps {
  icon: string;
  title: string;
  price: number;
}

export default function IssueTokensListItem({ icon, title, price }: itemProps): JSX.Element | null {
  return (
    <ItemWrapper>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TgradeLogo style={{ width: "25px" }} />
        <span style={{ marginLeft: "25px" }}>{title}</span>
      </div>
      <span>{price}</span>
    </ItemWrapper>
  );
}
