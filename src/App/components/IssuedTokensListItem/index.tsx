import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-token-round.svg";
import { ItemWrapper } from "./style";

interface itemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string;
  title: string;
  price: number;
  change: number;
  dso: string;
}

export default function IssueTokensListItem({
  icon,
  change,
  dso,
  title,
  price,
}: itemProps): JSX.Element | null {
  return (
    <ItemWrapper>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TgradeLogo style={{ width: "25px" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ marginLeft: "25px" }}>{title}</span>
          <span>{dso}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>{price}</span>
        <span>{change} %</span>
      </div>
    </ItemWrapper>
  );
}
