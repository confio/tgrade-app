import { Button, Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useHistory } from "react-router-dom";

const { Title } = Typography;

export default function Add(): JSX.Element {
  const history = useHistory();
  return (
    <PageLayout backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}` }}>
      <Stack gap="s4">
        <Title>Add Another Token</Title>
        <Button
          type="primary"
          onClick={() => history.push(`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddExisting}`)}
        >
          Existing
        </Button>
        <Button
          type="primary"
          onClick={() => history.push(`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddNew}`)}
        >
          New
        </Button>
      </Stack>
    </PageLayout>
  );
}
