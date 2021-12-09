import { TxResult } from "App/components/ShowTxResult";
import { DsoHomeParams } from "App/pages/DsoHome";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDsoName, useDso, useError, useSdk } from "service";
import { gtagProposalAction } from "utils/analytics";
import { Contract20WS } from "utils/cw20";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import { getPairsEager } from "utils/factory";
import { tokenObj } from "utils/tokens";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationWhitelistPair from "./components/ConfirmationWhitelistPair";
import FormWhitelistPair, { FormWhiteilstPairValues } from "./components/FormWhitelistPair";

export interface PairToken {
  readonly name: string;
  readonly address?: string;
  readonly dsoAddress?: string;
}

export interface TokensPerPair {
  readonly pairAddress: string;
  readonly tokenA: PairToken;
  readonly tokenB: PairToken;
}

interface ProposalWhitelistPairProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalWhitelistPair({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalWhitelistPairProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { address, client, signingClient, config },
  } = useSdk();
  const {
    dsoState: { dsos },
  } = useDso();

  const [pairAddress, setPairAddress] = useState("");
  const [comment, setComment] = useState("");

  const [tokensPerPairs, setTokensPerPairs] = useState<readonly TokensPerPair[]>([]);

  const getPairToken = useCallback(
    async function (token: tokenObj): Promise<PairToken> {
      if (token.native) {
        return { name: config.coinMap[token.native].denom };
      }

      if (!client) throw new Error("Missing client");
      if (!address) throw new Error("Missing address");
      if (!token.token) throw new Error("Found no native or CW20 token");

      const { symbol } = await Contract20WS.getTokenInfo(client, address, token.token, config);
      const dsoAddress = await Contract20WS.getDsoAddress(client, token.token);
      return { name: symbol, address: token.token, dsoAddress };
    },
    [address, client, config],
  );

  useEffect(() => {
    (async function getPairs() {
      if (!client || !signingClient) return;

      const pairs = await getPairsEager(client, config.factoryAddress);

      const tokensPerPairs: readonly TokensPerPair[] = await Promise.all(
        pairs.map(async (pair) => {
          const pairAddress = pair.contract_addr;
          const tokenA = await getPairToken(pair.asset_infos[0]);
          const tokenB = await getPairToken(pair.asset_infos[1]);

          return { pairAddress, tokenA, tokenB };
        }),
      );

      const tokensPerPairsWithDso = tokensPerPairs.filter(
        (pair) => pair.tokenA.dsoAddress === dsoAddress || pair.tokenB.dsoAddress === dsoAddress,
      );

      setTokensPerPairs(tokensPerPairsWithDso);
    })();
  }, [client, config.factoryAddress, dsoAddress, getPairToken, signingClient]);

  async function submitWhitelistPair({ comment }: FormWhiteilstPairValues) {
    setComment(comment);
    setProposalStep({ type: ProposalType.WhitelistPair, confirmation: true });
  }

  async function submitCreateProposal() {
    gtagProposalAction("whitelist_try");
    if (!signingClient || !client || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.propose(client, config.factoryAddress, address, comment, {
        whitelist_contract: pairAddress,
      });

      const dsoName = getDsoName(dsos, dsoAddress);
      setTxResult({
        msg: `Created proposal for whitelisting pair to ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
      });
      gtagProposalAction("whitelist_success");
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {proposalStep.confirmation ? (
        <ConfirmationWhitelistPair
          pairAddress={pairAddress}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.WhitelistPair })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormWhitelistPair
          tokensPerPairs={tokensPerPairs}
          pairAddress={pairAddress}
          setPairAddress={setPairAddress}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitWhitelistPair}
        />
      )}
    </>
  );
}
