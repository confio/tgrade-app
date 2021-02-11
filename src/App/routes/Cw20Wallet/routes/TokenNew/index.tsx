import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useError, useSdk } from "service";

const { Title } = Typography;

export default function TokenNew(): JSX.Element {
  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const address = getAddress();

  async function createNewToken() {
    const msg: any = {
      name: "Test1 coin",
      symbol: "TST",
      decimals: 6,
      initial_balances: [
        {
          address,
          amount: "1234567890",
        },
      ],
    };

    try {
      await getSigningClient().instantiate(getAddress(), 4, msg, "Test");
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <PageLayout backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}` }}>
      <Title>New token</Title>
      <Button type="primary" onClick={createNewToken}>
        Create
      </Button>
    </PageLayout>
  );
}
