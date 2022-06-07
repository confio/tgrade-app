import { Typography } from "antd";
import notFoundImg from "App/assets/images/not-found.png";
import Button from "App/components/Button";
import { useHistory } from "react-router-dom";

import { NotFoundPageLayout, NotFoundStack } from "./style";

const { Title, Text } = Typography;

export default function NotFound(): JSX.Element | null {
  const history = useHistory();

  return (
    <NotFoundPageLayout maxwidth="75rem">
      <NotFoundStack>
        <img alt="" src={notFoundImg} />
        <Title>404</Title>
        <Title level={2}>Page not found</Title>
        <Text>
          We are looking for your page…
          <br />
          but we can't find it
        </Text>
        <Button type="ghost" onClick={() => history.goBack()}>
          Go back
        </Button>
      </NotFoundStack>
    </NotFoundPageLayout>
  );
}
