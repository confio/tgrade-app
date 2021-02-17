import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { Loading } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import FormMintTokens, { FormMintTokensFields } from "./FormMintTokens";
import { Amount, MainStack } from "./style";

const { Title, Text } = Typography;

interface MintParams {
  readonly contractAddress: string;
}

export default function Mint(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const { contractAddress }: MintParams = useParams();
  const { url: pathMintMatched } = useRouteMatch();
  const pathTokenDetail = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}`;
  const history = useHistory();
  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const client = getSigningClient();
  const address = getAddress();

  const [cw20Token, setCw20Token] = useState<Cw20Token>();
  const [mintCap, setMintCap] = useState<string>();

  useEffect(() => {
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateCw20TokenAndMintCap() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }
      setCw20Token(cw20Token);

      const { cap: mintCap } = await cw20Contract.minter(address);
      setMintCap(mintCap);
    })();
  }, [address, client, contractAddress, handleError]);

  async function mintTokensAction(values: FormMintTokensFields) {
    if (!cw20Token) return;
    setLoading(true);

    const { address: recipientAddress, amount } = values;
    const cw20Contract = CW20(client).use(contractAddress);

    try {
      const mintAmount = Decimal.fromUserInput(amount, cw20Token.decimals).atomics;
      await cw20Contract.mint(address, recipientAddress, mintAmount);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: `${amount} ${cw20Token.symbol} successfully minted to ${recipientAddress}`,
          customButtonText: "Token detail",
          customButtonActionPath: pathTokenDetail,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: "Mint transaction failed:",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathMintMatched,
        } as OperationResultState,
      });
    }
  }

  const amountToDisplay = mintCap ? Decimal.fromAtomics(mintCap, cw20Token?.decimals ?? 0).toString() : "No";
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const maxAmount = mintCap ? Decimal.fromAtomics(mintCap, cw20Token?.decimals ?? 0) : undefined;

  return loading ? (
    <Loading loadingText={`Minting ${cw20Token?.symbol || ""}...`} />
  ) : (
    <PageLayout backButtonProps={{ path: pathTokenDetail }}>
      <MainStack>
        <Title>{cw20Token?.symbol || ""}</Title>
        <Amount>
          <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
          {amountDecimal && <Text>{amountDecimal}</Text>}
          <Text>{" cap"}</Text>
        </Amount>
        <FormMintTokens
          tokenName={cw20Token?.symbol || ""}
          maxAmount={maxAmount}
          mintTokensAction={mintTokensAction}
        />
      </MainStack>
    </PageLayout>
  );
}
