import Stack from "App/components/Stack/style";
import Center from "App/components/Center";
import * as React from "react";
import { HTMLAttributes, useEffect } from "react";
import { useError } from "service";
import successIcon from "App/assets/icons/tick.svg";
import failIcon from "App/assets/icons/warning.svg";
import { ButtonStack, ResultDescription, ResultIcon, ResultText } from "./style";

export interface TxResult {
  readonly contractAddress?: string;
  readonly msg?: string;
  readonly error?: string;
}

type TxResultProps = TxResult & HTMLAttributes<HTMLOrSVGElement>;

export default function ShowTxResult({ msg, error, children }: TxResultProps): JSX.Element {
  const { clearError } = useError();
  useEffect(clearError, [clearError]);

  return (
    <Center>
      <Stack gap="s5">
        <ResultIcon alt="Result icon" src={error ? failIcon : successIcon} />
        {msg ? (
          <Stack gap="s-1">
            <ResultText>Your transaction was approved!</ResultText>
            <ResultDescription>{msg}</ResultDescription>
          </Stack>
        ) : null}
        {error ? (
          <Stack gap="s-1">
            <ResultText>Your transaction was rejected</ResultText>
            <ResultDescription>{error}</ResultDescription>
          </Stack>
        ) : null}
        <ButtonStack>{children}</ButtonStack>
      </Stack>
    </Center>
  );
}
