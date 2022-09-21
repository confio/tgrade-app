import { Typography } from "antd";
import { TokenHuman } from "utils/tokens";

const { Text } = Typography;

interface TokenSelectorProps {
  readonly label: string;
  readonly token: TokenHuman | undefined;
}

export function TokenSelector({ label, token }: TokenSelectorProps): JSX.Element {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        padding: "20px",
        border: "1px solid #EDEEEE",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <Text>{label}</Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {token ? <img alt="" src={token.img} /> : null}
            <Text>Select token</Text>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <Text>Balance</Text>
        {token ? <Text>{token.humanBalance}</Text> : null}
      </div>
    </div>
  );
}
