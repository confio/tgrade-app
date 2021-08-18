import { ReactComponent as TgradeLogo } from "App/assets/icons/tgradeLogo.svg";
import { ItemWrapper } from "./style";

interface itemProps {
  icon: string;
  title: string;
  value: number;
  price: number;
}

export default function IssueTokensListItem({ icon, value, title, price }: itemProps): JSX.Element | null {
  return (
    <ItemWrapper>
      <TgradeLogo style={{ width: "20px" }} />
      <span>{value}</span>
      <span>{title}</span>
      <span>${price}</span>
    </ItemWrapper>
  );
}
