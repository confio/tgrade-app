import IssueTokensListItem from "../IssuedTokensListItem";
import { MockData } from "./__mocks__/mockData";

export default function IssuedTokensList(): JSX.Element | null {
  return (
    <ul style={{ width: "100%" }}>
      {MockData.data.map((item) => (
        <IssueTokensListItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          value={item.value}
          price={item.price}
        ></IssueTokensListItem>
      ))}
    </ul>
  );
}
