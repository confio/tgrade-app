import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import Field from "App/components/Field";
import { FormikErrors } from "formik";
import * as React from "react";
import { getFormItemName } from "utils/forms";
import { StyledFieldsTokenSupply, TokenLookStack } from "./style";

const { Text } = Typography;

interface FieldsTokenSupplyProps {
  readonly formikValues: {
    [x: string]: string;
  };
  readonly formikErrors: FormikErrors<{
    [x: string]: string;
  }>;
  readonly initialSupplyLabel: string;
  readonly decimalsLabel: string;
  readonly tokenSymbolLabel: string;
}

export default function FieldsTokenSupply({
  formikValues,
  formikErrors,
  initialSupplyLabel,
  decimalsLabel,
  tokenSymbolLabel,
}: FieldsTokenSupplyProps): JSX.Element {
  function getTokenLook() {
    const supplyError = formikErrors[getFormItemName(initialSupplyLabel)];
    const decimalsError = formikErrors[getFormItemName(decimalsLabel)];
    const symbolError = formikErrors[getFormItemName(tokenSymbolLabel)];

    if (supplyError || decimalsError || symbolError) return "—";

    const supplyValue = formikValues[getFormItemName(initialSupplyLabel)];
    const decimalsValue = formikValues[getFormItemName(decimalsLabel)];
    const symbolValue = formikValues[getFormItemName(tokenSymbolLabel)];

    try {
      const decimalsInt = parseInt(decimalsValue, 10);
      const floatAmount = Decimal.fromUserInput(supplyValue, decimalsInt).toFloatApproximation();
      const amount = floatAmount / 10 ** decimalsInt;
      return `${amount} ${symbolValue}`;
    } catch {
      return "—";
    }
  }

  return (
    <StyledFieldsTokenSupply>
      <Field label={initialSupplyLabel} placeholder="Enter initial supply" />
      <Field label={decimalsLabel} placeholder="Enter decimals" />
      <TokenLookStack gap="s2">
        <Text>Your token will look like:</Text>
        <Text>{getTokenLook()}</Text>
      </TokenLookStack>
    </StyledFieldsTokenSupply>
  );
}
