import { Button, Typography } from "antd";
import * as React from "react";
import { ComponentProps } from "react";
import { TokenItem } from "./style";

const { Text } = Typography;

interface TokenButtonProps extends ComponentProps<typeof Button> {
  readonly denom: string;
  readonly amount: string;
}

export default function TokenButton({ denom, amount, ...restProps }: TokenButtonProps): JSX.Element {
  return (
    <Button data-size="large" type="primary" {...restProps}>
      <TokenItem>
        <Text>{denom}</Text>
        <Text>{amount !== "0" ? amount : "No tokens"}</Text>
      </TokenItem>
    </Button>
  );
}
