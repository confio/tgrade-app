import IssueTokensListItem from "../IssuedTokensListItem";
import { MockData } from "./__mocks__/mockData";

export default function IssuedTokensList(): JSX.Element | null {
  const handleClick = (event: any) => {
    console.log(event.target);
  };
  return (
    <ul style={{ width: "100%", listStyle: "none", paddingLeft: "0" }}>
      {MockData.data.map((item) => (
        <IssueTokensListItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          price={item.price}
          change={item.change}
          dso={item.dso}
        ></IssueTokensListItem>
      ))}
    </ul>
  );
}
