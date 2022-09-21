import { Typography } from "antd";
import Button from "App/components/Button";
import { TxResult } from "App/components/ShowTxResult";
import { useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { Contract20WS } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { TcContractQuerier } from "utils/trustedCircle";

import { PairWithAuth, TokenWhitelisting, TokenWithAuth } from "../..";

const { Text } = Typography;

interface AuthorizePairFormProps {
  readonly tokenFrom: TokenWithAuth;
  readonly tokenTo: TokenWithAuth;
  readonly pair: PairWithAuth;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
  readonly reloadToken: (tokenAddress: string) => Promise<TokenWithAuth | undefined>;
}

export function AuthorizePairForm({
  tokenFrom,
  tokenTo,
  pair,
  setTxResult,
  reloadToken,
}: AuthorizePairFormProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { client, address, signingClient },
  } = useSdk();

  const [isApprovingFrom, setApprovingFrom] = useState(false);
  const [isApprovingTo, setApprovingTo] = useState(false);
  const [tcNames, setTcNames] = useState<readonly [string?, string?]>([undefined, undefined]);

  const getTcName = useCallback(
    async (whitelisting: TokenWhitelisting): Promise<string | undefined> => {
      if (!client) return;

      if (whitelisting.status !== "unneeded") {
        const tcContract = new TcContractQuerier(whitelisting.tcAddress, client);
        const { name } = await tcContract.getTc();
        return name;
      }

      return undefined;
    },
    [client],
  );

  useEffect(() => {
    (async function getTcNames() {
      const tcNames = await Promise.all([
        getTcName(pair.whitelisting.tokenA),
        getTcName(pair.whitelisting.tokenB),
      ]);
      setTcNames(tcNames);
    })();
  }, [getTcName, pair.whitelisting.tokenA, pair.whitelisting.tokenB]);

  const approveToken = useCallback(
    async (tokenAddress: string, setApproving: React.Dispatch<React.SetStateAction<boolean>>) => {
      if (!signingClient || !address) return;

      try {
        setApproving(true);
        const txHash = await Contract20WS.approve(signingClient, tokenAddress, address, pair.contract_addr);
        const tokenSymbol = tokenAddress === tokenFrom.address ? tokenFrom.symbol : tokenTo.symbol;
        setTxResult({ msg: `Successfully approved ${tokenSymbol} token. Transaction ID: ${txHash}` });
        await reloadToken(tokenAddress);
      } catch (error) {
        if (!(error instanceof Error)) return;
        setTxResult({ error: getErrorFromStackTrace(error) });
        handleError(error);
      } finally {
        setApproving(false);
      }
    },
    [
      address,
      handleError,
      pair.contract_addr,
      reloadToken,
      setTxResult,
      signingClient,
      tokenFrom.address,
      tokenFrom.symbol,
      tokenTo.symbol,
    ],
  );

  return (
    <div>
      <Text>
        The {`${tokenFrom.symbol} ⇄ ${tokenTo.symbol}`} pair has been created with address ($
        {pair.contract_addr}), but it needs to be authorized before operating with it.
      </Text>
      <div>
        {tokenFrom.approval === "needed" ? (
          <Button onClick={() => approveToken(tokenFrom.address, setApprovingFrom)} loading={isApprovingFrom}>
            Approve {tokenFrom.symbol}
          </Button>
        ) : null}
        {tokenTo.approval === "needed" ? (
          <Button onClick={() => approveToken(tokenTo.address, setApprovingTo)} loading={isApprovingTo}>
            Approve {tokenTo.symbol}
          </Button>
        ) : null}
      </div>
      {pair.whitelisting.tokenA.status === "needed" || pair.whitelisting.tokenB.status === "needed" ? (
        <div>
          <Text>The pair needs to be whitelisted in the following Trusted Circles:</Text>
          <ul>
            {pair.whitelisting.tokenA.status === "needed" && tcNames[0] ? (
              <li>{`${tcNames[0]} (${pair.whitelisting.tokenA.tcAddress})`}</li>
            ) : null}
            {pair.whitelisting.tokenB.status === "needed" && tcNames[1] ? (
              <li>{`${tcNames[1]} (${pair.whitelisting.tokenB.tcAddress})`}</li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
