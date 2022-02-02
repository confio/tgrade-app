import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { TrustedCircleAdjustements } from "utils/trustedCircle";

import { ChangedField, FieldGroup, TextLabel, TextValue } from "../style";

interface ProposalEditDsoProps {
  readonly proposalEditDso: TrustedCircleAdjustements | undefined;
}

export default function ProposalEditDso({ proposalEditDso }: ProposalEditDsoProps): JSX.Element | null {
  const { handleError } = useError();
  const {
    sdkState: { config },
  } = useSdk();

  const [displayEscrow, setDisplayEscrow] = useState("0");

  useEffect(() => {
    (async function formatEscrow() {
      const nativeEscrow = proposalEditDso?.escrow_amount;
      if (!nativeEscrow) return;

      try {
        const { amount: displayEscrow } = nativeCoinToDisplay(
          { denom: config.feeToken, amount: nativeEscrow },
          config.coinMap,
        );

        setDisplayEscrow(displayEscrow);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [config.coinMap, config.feeToken, handleError, proposalEditDso?.escrow_amount]);

  return proposalEditDso ? (
    <FieldGroup>
      {proposalEditDso?.name ? (
        <ChangedField>
          <TextLabel>Trusted Circle name</TextLabel>
          <TextValue>{proposalEditDso.name}</TextValue>
        </ChangedField>
      ) : null}
      {proposalEditDso?.quorum ? (
        <ChangedField>
          <TextLabel>Quorum</TextLabel>
          <TextValue>{(parseFloat(proposalEditDso.quorum) * 100).toFixed(2).toString()}%</TextValue>
        </ChangedField>
      ) : null}
      {proposalEditDso?.threshold ? (
        <ChangedField>
          <TextLabel>Threshold</TextLabel>
          <TextValue>{(parseFloat(proposalEditDso.threshold) * 100).toFixed(2).toString()}%</TextValue>
        </ChangedField>
      ) : null}
      {proposalEditDso?.voting_period ? (
        <ChangedField>
          <TextLabel>Voting duration</TextLabel>
          <TextValue>{proposalEditDso.voting_period}</TextValue>
        </ChangedField>
      ) : null}
      {proposalEditDso?.escrow_amount ? (
        <ChangedField>
          <TextLabel>Escrow amount</TextLabel>
          <TextValue>{displayEscrow}</TextValue>
        </ChangedField>
      ) : null}
      {proposalEditDso?.allow_end_early !== undefined && proposalEditDso?.allow_end_early !== null ? (
        <ChangedField>
          <TextLabel>Early pass</TextLabel>
          <TextValue>{proposalEditDso.allow_end_early ? "Enabled" : "Disabled"}</TextValue>
        </ChangedField>
      ) : null}
    </FieldGroup>
  ) : null;
}
