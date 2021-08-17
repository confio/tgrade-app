import { Col } from "antd";
import Button from "./style";

const SubmitButton = ({
  title,
  loading,
  disabled,
  onClick,
}: {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: any;
}): JSX.Element => {
  return (
    <Col span={24}>
      <Button disabled={disabled} onClick={onClick} loading={loading} htmlType="submit">
        {title}
      </Button>
    </Col>
  );
};
export default SubmitButton;
