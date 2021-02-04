import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { YourAccount } from "App/components/logic";
import React, { useState } from "react";
import { useSdk } from "service";
import FormSearchName from "./components/FormSearchName";
import TokenList from "./components/TokenList";
import { MainStack } from "./style";

const { Title } = Typography;

export default function Tokens(): JSX.Element {
  const { getAddress } = useSdk();
  const [currentAddress, setCurrentAddress] = useState(getAddress());

  return (
    <PageLayout>
      <MainStack>
        <Title>Tokens</Title>
        <FormSearchName currentAddress={currentAddress} setCurrentAddress={setCurrentAddress} />
        <TokenList currentAddress={currentAddress} />
        <YourAccount hideBalance />
      </MainStack>
    </PageLayout>
  );
}
