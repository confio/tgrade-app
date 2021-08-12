import Chart from "App/components/Chart";

export default function TMarketHome(): JSX.Element | null {
  return (
    <div style={{ width: "90%" }}>
      <div style={{ width: "50%" }}>
        <h2>Welcome to T-Market</h2>
        <h3>What is T-market?</h3>
        <Chart />
      </div>
    </div>
  );
}
