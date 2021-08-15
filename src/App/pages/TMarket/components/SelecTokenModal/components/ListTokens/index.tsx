import { Row, Typography } from "antd";
import { TokenProps } from "utils/tokens";
// import { useTmarket } from "service/tmarket";
import StyledList from "./style";

interface ListTokensProps {
  setToken: (t: TokenProps) => void;
  closeModal: () => void;
  tokens: Array<TokenProps>;
}

export default function ListTokens({ tokens, setToken, closeModal }: ListTokensProps): JSX.Element {
  return (
    <StyledList
      dataSource={[...tokens]}
      renderItem={(item: any) => (
        <StyledList.Item>
          <Row
            onClick={() => {
              setToken(item);
              closeModal();
            }}
            className="token-item"
          >
            <img src={item?.img} alt={item?.img} />
            <div>
              <Typography.Title>{item.symbol}</Typography.Title>
              <Typography.Paragraph>{item.name}</Typography.Paragraph>
            </div>
          </Row>
        </StyledList.Item>
      )}
    />
  );
}
