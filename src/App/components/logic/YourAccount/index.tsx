import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import copyToClipboard from "clipboard-copy";
import * as React from "react";
import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { useSdk } from "service";
import { printableBalance, useBalance } from "utils/currency";
import { Balance, DataDivider } from "./style";

const { Title, Text } = Typography;

type YourAccountProps = ComponentProps<typeof Stack> & {
  readonly hideTitle?: boolean;
  readonly hideBalance?: boolean;
};

export default function YourAccount({ tag, hideTitle, hideBalance }: YourAccountProps): JSX.Element {
  const { t } = useTranslation("common");
  const { getAddress } = useSdk();
  const address = getAddress();
  const balance = useBalance();

  return (
    <Stack tag={tag}>
      {!hideTitle && (
        <Stack gap="s-2" tag="header">
          <Title level={3}>{t("yourAccount.title")}</Title>
          {!hideBalance && <DataDivider />}
        </Stack>
      )}
      <Balance>
        <Text>{address}</Text>
        {!hideBalance && <Text>({printableBalance(balance)})</Text>}
      </Balance>
      <Button type="primary" onClick={() => copyToClipboard(address)}>
        {t("yourAccount.copyAddress")}
      </Button>
    </Stack>
  );
}
