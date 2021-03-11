import { Button, Typography } from "antd";
import * as React from "react";
import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { TokenItem } from "./style";

const { Text } = Typography;

interface TokenButtonProps extends ComponentProps<typeof Button> {
  readonly denom: string;
  readonly amount: string;
}

export default function TokenButton({ denom, amount, ...restProps }: TokenButtonProps): JSX.Element {
  const { t } = useTranslation("wallet");
  return (
    <Button data-size="large" type="primary" {...restProps}>
      <TokenItem>
        <Text>{denom}</Text>
        <Text>{`${amount} ${t("tokens")}`}</Text>
      </TokenItem>
    </Button>
  );
}
