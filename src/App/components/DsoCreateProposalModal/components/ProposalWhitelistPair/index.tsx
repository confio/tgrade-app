import { TxResult } from "App/components/ShowTxResult";
import { DsoHomeParams } from "App/pages/DsoHome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDsoName, useDso, useError, useSdk } from "service";
import { useTokens } from "service/tokens";
import { gtagProposalAction } from "utils/analytics";
import { Contract20WS } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { TcContract } from "utils/trustedCircle";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationWhitelistPair from "./components/ConfirmationWhitelistPair";
import FormWhitelistPair, { FormWhiteilstPairValues } from "./components/FormWhitelistPair";

export interface TokensPerPair {
  readonly pairAddress: string;
  readonly tokenA: { readonly address: string; readonly symbol?: string };
  readonly tokenB: { readonly address: string; readonly symbol?: string };
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
    tokensState: { tokens, pairs },
  } = useTokens();
  const {
    dsoState: { dsos },
  } = useDso();

  const [pairAddress, setPairAddress] = useState("");
  const [comment, setComment] = useState("");
  const [isLoadingPairs, setLoadingPairs] = useState(false);

  const [tokensPerPairs, setTokensPerPairs] = useState<readonly TokensPerPair[]>([]);

  useEffect(() => {
    (async function getPairs() {
      if (!client) return;
      setLoadingPairs(true);

      const tokensPerPairs: readonly TokensPerPair[] = Array.from(pairs.values()).map((pair) => {
        const pairAddress = pair.contract_addr;
        const tokenAAddress = pair.asset_infos[0].native || pair.asset_infos[0].token || "";
        const tokenBAddress = pair.asset_infos[1].native || pair.asset_infos[1].token || "";

        const tokenA = {
          address: tokenAAddress,
          symbol: tokenAAddress ? tokens.get(tokenAAddress)?.symbol : undefined,
        };
        const tokenB = {
          address: tokenBAddress,
          symbol: tokenBAddress ? tokens.get(tokenBAddress)?.symbol : undefined,
        };

        return { pairAddress, tokenA, tokenB };
      });

      const markedTokensPerPairs: readonly TokensPerPair[] = await Promise.all(
        tokensPerPairs.map(async (pairAssets) => {
          const { pairAddress, tokenA, tokenB } = pairAssets;
          const dsoAddressA = await Contract20WS.getDsoAddress(client, tokenA.address);
          const dsoAddressB = await Contract20WS.getDsoAddress(client, tokenB.address);
          // Remove if no token is associated to current TC
          if (dsoAddressA !== dsoAddress && dsoAddressB !== dsoAddress) {
            return { ...pairAssets, pairAddress: "none" };
          }

          // Add if tokenA is associated to current TC and pair is not whitelisted
          if (dsoAddressA === dsoAddress) {
            const pairWhitelistedInTCA = await Contract20WS.isWhitelisted(
              client,
              tokenA.address,
              pairAddress,
            );
            if (!pairWhitelistedInTCA) return pairAssets;
          }

          // Add if tokenB is associated to current TC and pair is not whitelisted
          if (dsoAddressB === dsoAddress) {
            const pairWhitelistedInTCB = await Contract20WS.isWhitelisted(
              client,
              tokenB.address,
              pairAddress,
            );
            if (!pairWhitelistedInTCB) return pairAssets;
          }

          // Remove if pair is whitelisted in current TC
          return { ...pairAssets, pairAddress: "none" };
        }),
      );

      const filteredTokensPerPair = markedTokensPerPairs.filter(
        (pairAssets) => pairAssets.pairAddress !== "none",
      );

      setTokensPerPairs(filteredTokensPerPair);
      setLoadingPairs(false);
    })();
  }, [client, dsoAddress, pairs, tokens]);

  async function submitWhitelistPair({ comment }: FormWhiteilstPairValues) {
    setComment(comment);
    setProposalStep({ type: ProposalType.WhitelistPair, confirmation: true });
  }

  async function submitCreateProposal() {
    gtagProposalAction("whitelist_try");
    if (!signingClient || !client || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new TcContract(dsoAddress, signingClient, config.gasPrice);
      const { txHash } = await dsoContract.propose(address, comment, {
        whitelist_contract: pairAddress,
      });

      const dsoName = getDsoName(dsos, dsoAddress);
      setTxResult({
        msg: `Created proposal for whitelisting pair to ${dsoName} (${dsoAddress}). Transaction ID: ${txHash}`,
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
          isLoadingPairs={isLoadingPairs}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitWhitelistPair}
        />
      )}
    </>
  );
}
