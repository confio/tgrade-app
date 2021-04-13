import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import { Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, setLoading, useError, useLayout, useSdk } from "service";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import FormMintTokens, { FormMintTokensFields } from "./FormMintTokens";

const { Title, Text } = Typography;

interface MintParams {
  readonly contractAddress: string;
}

export default function Mint(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");

  const history = useHistory();
  const { contractAddress }: MintParams = useParams();
  const { url: pathMintMatched } = useRouteMatch();
  const pathTokenDetail = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}`;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathTokenDetail } }), [
    layoutDispatch,
    pathTokenDetail,
  ]);

  const { handleError } = useError();
  const {
    sdkState: { signingClient, address },
  } = useSdk();

  const [cw20Token, setCw20Token] = useState<Cw20Token>();
  const [mintCap, setMintCap] = useState<string>();

  useEffect(() => {
    let mounted = true;
    const cw20Contract = CW20(signingClient).use(contractAddress);

    (async function updateCw20TokenAndMintCap() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }
      if (mounted) setCw20Token(cw20Token);

      const { cap: mintCap } = await cw20Contract.minter(address);
      if (mounted) setMintCap(mintCap);
    })();

    return () => {
      mounted = false;
    };
  }, [address, contractAddress, handleError, signingClient, t]);

  async function mintTokensAction(values: FormMintTokensFields) {
    if (!cw20Token) return;
    setLoading(layoutDispatch, `${t("minting", { symbol: cw20Token.symbol })}`);

    const { address: recipientAddress, amount } = values;
    const cw20Contract = CW20(signingClient).use(contractAddress);

    try {
      const mintAmount = Decimal.fromUserInput(amount, cw20Token.decimals).atomics;
      await cw20Contract.mint(address, recipientAddress, mintAmount);

      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("mintSuccess", { amount, symbol: cw20Token.symbol, recipientAddress }),
          customButtonText: t("tokenDetail"),
          customButtonActionPath: pathTokenDetail,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("mintFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathMintMatched,
        } as OperationResultState,
      });
    }
  }

  const amountToDisplay = mintCap ? Decimal.fromAtomics(mintCap, cw20Token?.decimals ?? 0).toString() : "No";
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const maxAmount = mintCap ? Decimal.fromAtomics(mintCap, cw20Token?.decimals ?? 0) : undefined;

  return (
    <Stack gap="s4">
      <Title>{cw20Token?.symbol || ""}</Title>
      <TokenAmount>
        <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
        {amountDecimal && <Text>{amountDecimal}</Text>}
        <Text>{` ${t("cap")}`}</Text>
      </TokenAmount>
      <FormMintTokens
        tokenName={cw20Token?.symbol || ""}
        maxAmount={maxAmount}
        mintTokensAction={mintTokensAction}
      />
    </Stack>
  );
}
