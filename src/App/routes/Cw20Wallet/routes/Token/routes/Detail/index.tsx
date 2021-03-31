import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { useLayout } from "service/layout";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import FormSearchAllowing from "./components/FormSearchAllowing";
import FormSendTokens, { FormSendTokensFields } from "./components/FormSendTokens";

const { Title, Text } = Typography;

const pathTokens = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}`;

interface DetailParams {
  readonly contractAddress: string;
  readonly allowingAddress?: string;
}

export default function Detail(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");
  const history = useHistory();
  const { contractAddress, allowingAddress: allowingAddressParam }: DetailParams = useParams();
  const pathTokenDetail = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}`;
  const backButtonProps = useMemo(() => ({ path: pathTokens }), []);
  const { setLoading } = useLayout({ backButtonProps });

  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const client = getSigningClient();
  const address = getAddress();

  const [allowingAddress, setAllowingAddress] = useState(allowingAddressParam);
  const [allowance, setAllowance] = useState<string>();
  const [allowingBalance, setAllowingBalance] = useState<string>();
  const [cw20Token, setCw20Token] = useState<Cw20Token>();
  const [isUserMinter, setUserMinter] = useState(false);

  useEffect(() => {
    let mounted = true;
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateCw20TokenAndAllowance() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(t("error.noCw20Found", { contractAddress })));
        return;
      }

      if (allowingAddress) {
        try {
          const { allowance } = await cw20Contract.allowance(allowingAddress, address);
          const allowingBalance = await cw20Contract.balance(allowingAddress);
          if (mounted) setCw20Token(cw20Token);
          if (mounted) setAllowance(allowance);
          if (mounted) setAllowingBalance(allowingBalance);
        } catch (error) {
          handleError(error);
        }
      } else {
        if (mounted) setCw20Token(cw20Token);
        if (mounted) setAllowance(undefined);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [address, allowingAddress, client, contractAddress, handleError, t]);

  useEffect(() => {
    let mounted = true;
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateIsUserMinter() {
      try {
        const minterResponse = await cw20Contract.minter(address);
        if (minterResponse?.minter === address) {
          if (mounted) setUserMinter(true);
        } else {
          if (mounted) setUserMinter(false);
        }
      } catch (error) {
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [address, client, contractAddress, handleError]);

  async function updateAllowance(allowingAddress?: string) {
    if (!allowingAddress) {
      setAllowingAddress(undefined);
      setAllowance(undefined);
      return;
    }

    setAllowingAddress(allowingAddress);
    const cw20contract = CW20(client).use(contractAddress);
    try {
      const { allowance } = await cw20contract.allowance(allowingAddress, address);
      setAllowance(allowance);
    } catch (error) {
      handleError(error);
    }
  }

  async function sendTokensAction(values: FormSendTokensFields) {
    if (!cw20Token) return;
    setLoading(`Sending ${cw20Token.symbol}...`);

    const { address: recipientAddress, amount } = values;
    const cw20Contract = CW20(client).use(contractAddress);
    const symbol = cw20Token.symbol;

    try {
      const transferAmount = Decimal.fromUserInput(amount, cw20Token.decimals).atomics;

      if (allowingAddress) {
        await cw20Contract.transferFrom(address, allowingAddress, recipientAddress, transferAmount);

        setLoading(false);

        history.push({
          pathname: paths.operationResult,
          state: {
            success: true,
            message: t("transferSuccess", { amount, symbol, recipientAddress, allowingAddress }),
            customButtonText: t("tokenDetail"),
            customButtonActionPath: pathTokenDetail,
          } as OperationResultState,
        });
      } else {
        const response = await cw20Contract.transfer(address, recipientAddress, transferAmount);
        if (!response) {
          throw new Error(t("transferFail"));
        }

        setLoading(false);

        history.push({
          pathname: paths.operationResult,
          state: {
            success: true,
            message: t("sendSuccess", { amount, symbol, recipientAddress }),
            customButtonText: t("tokenDetail"),
            customButtonActionPath: pathTokenDetail,
          } as OperationResultState,
        });
      }
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("sendSuccess"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathTokenDetail,
        } as OperationResultState,
      });
    }
  }

  function goToAllowances() {
    history.push(`${pathTokenDetail}${paths.cw20Wallet.allowances}`);
  }

  function goToMint() {
    history.push(`${pathTokenDetail}${paths.cw20Wallet.mint}`);
  }

  const amountToDisplay = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");
  const allowanceToDisplay = Decimal.fromAtomics(allowance || "0", cw20Token?.decimals ?? 0).toString();
  const [allowanceInteger, allowanceDecimal] = allowanceToDisplay.split(".");
  const allowingBalanceToDisplay = Decimal.fromAtomics(
    allowingBalance || "0",
    cw20Token?.decimals ?? 0,
  ).toString();
  const [allowingBalanceInteger, allowingBalanceDecimal] = allowingBalanceToDisplay.split(".");

  const maxAmount = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0);

  return (
    <Stack gap="s4">
      <Stack gap="s-2">
        <Title>{cw20Token?.symbol || ""}</Title>
        <FormSearchAllowing initialAddress={allowingAddress} setSearchedAddress={updateAllowance} />
        {allowingAddress ? (
          <Button type="default" onClick={() => updateAllowance()}>
            {t("backToAccount")}
          </Button>
        ) : null}
      </Stack>
      <Stack gap="s-2">
        <TokenAmount>
          <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
          {amountDecimal && <Text>{amountDecimal}</Text>}
          <Text>{` ${t("tokens")}`}</Text>
        </TokenAmount>
        {allowingAddress ? (
          <TokenAmount>
            <Text>{`${allowingBalanceInteger}${allowingBalanceDecimal ? "." : ""}`}</Text>
            {allowingBalanceDecimal && <Text>{allowingBalanceDecimal}</Text>}
            <Text>{` ${t("allowingTokens")}`}</Text>
          </TokenAmount>
        ) : null}
        {allowance ? (
          <TokenAmount>
            <Text>{`${allowanceInteger}${allowanceDecimal ? "." : ""}`}</Text>
            {allowanceDecimal && <Text>{allowanceDecimal}</Text>}
            <Text>{` ${t("allowance")}`}</Text>
          </TokenAmount>
        ) : null}
      </Stack>
      <FormSendTokens
        tokenName={cw20Token?.symbol || ""}
        maxAmount={maxAmount}
        sendTokensAction={sendTokensAction}
      />
      <Stack>
        {!allowingAddress && isUserMinter ? (
          <Button type="primary" onClick={goToMint}>
            {t("mintTokens")}
          </Button>
        ) : null}
        {!allowingAddress ? (
          <Button type="primary" onClick={goToAllowances}>
            {t("myAllowances")}
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
