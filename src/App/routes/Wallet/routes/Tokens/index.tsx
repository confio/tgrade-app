import { Button, Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import * as React from "react";
import { useState } from "react";
import { useSdk } from "service";
import FormSearchName from "./components/FormSearchName";
import TokenList from "./components/TokenList";

const { Title } = Typography;

export default function Tokens(): JSX.Element {
  const { getAddress } = useSdk();
  const address = getAddress();
  const [currentAddress, setCurrentAddress] = useState(address);

  return (
    <PageLayout hide="back-button">
      <Stack gap="s4">
        <Title>Tokens</Title>
        <FormSearchName currentAddress={currentAddress} setCurrentAddress={setCurrentAddress} />
        <TokenList currentAddress={currentAddress} />
        {currentAddress !== address ? (
          <Button type="default" onClick={() => setCurrentAddress(address)}>
            Back to My Account
          </Button>
        ) : null}
      </Stack>
    </PageLayout>
  );
}
