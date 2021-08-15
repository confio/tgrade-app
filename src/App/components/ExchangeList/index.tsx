import ExchangeListItem from "App/components/ExchangeListItem";
import { MockData } from "./__mocks__/mockData";

export default function ExchangeList(): JSX.Element | null {
  return (
    <ul style={{ width: "100%" }}>
      {MockData.data.map((item) => (
        <ExchangeListItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          value={item.value}
          price={item.price}
        ></ExchangeListItem>
      ))}
    </ul>
  );
}
