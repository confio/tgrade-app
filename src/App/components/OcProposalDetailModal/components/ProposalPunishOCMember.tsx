import { Decimal } from "@cosmjs/math";
import AddressList from "App/components/AddressList";
import AddressTag from "App/components/AddressTag";
import { useEffect, useState } from "react";
import { useError, useOc, useSdk } from "service";
import { DsoContractQuerier, Punishment } from "utils/dso";
import { isValidAddress } from "utils/forms";

import { AddressField, ChangedField, TextLabel, TextValue } from "../style";

interface ProposalPunishOCMemberProps {
  readonly proposalPunishVotingMember: Punishment | undefined;
}

export default function ProposalPunishOCMember({
  proposalPunishVotingMember,
}: ProposalPunishOCMemberProps): JSX.Element | null {
  const memberToPunish =
    proposalPunishVotingMember?.BurnEscrow?.member || proposalPunishVotingMember?.DistributeEscrow?.member;

  const kickOutMember =
    proposalPunishVotingMember?.BurnEscrow?.kick_out ||
    proposalPunishVotingMember?.DistributeEscrow?.kick_out;

  const slashingPercentage =
    proposalPunishVotingMember?.BurnEscrow?.slashing_percentage ||
    proposalPunishVotingMember?.DistributeEscrow?.slashing_percentage;

  const distributionList = proposalPunishVotingMember?.DistributeEscrow?.distribution_list ?? [];

  const {
    ocState: { ocAddress },
  } = useOc();
  const { handleError } = useError();
  const {
    sdkState: { config, client },
  } = useSdk();
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  const [memberEscrow, setMemberEscrow] = useState("0");
  const [toSlash, setToSlash] = useState("0");

  useEffect(() => {
    (async function updateMemberEscrow() {
      if (!ocAddress || !client || !memberToPunish) return;

      if (!isValidAddress(memberToPunish, config.addressPrefix)) {
        setMemberEscrow("0");
        console.log({ hi: 0 });
        return;
      }

      const dsoContract = new DsoContractQuerier(ocAddress, client);

      try {
        const escrowResponse = await dsoContract.getEscrow(memberToPunish);
        if (!escrowResponse) throw new Error("No escrow found for user");

        const decimals = config.coinMap[config.feeToken].fractionalDigits;
        const userEscrowDecimal = Decimal.fromAtomics(escrowResponse.paid, decimals);
        setMemberEscrow(userEscrowDecimal.toString());
        console.log({ hi: 1 });
      } catch (error) {
        console.error(error);
        setMemberEscrow("0");
        console.log({ hi: 2 });
      }
    })();
  }, [client, config.addressPrefix, config.coinMap, config.feeToken, memberToPunish, ocAddress]);

  useEffect(() => {
    if (!slashingPercentage) return;

    try {
      const slashingPercentageNumber = parseFloat(slashingPercentage);
      const toSlash = (
        Decimal.fromUserInput(
          memberEscrow,
          config.coinMap[config.feeToken].fractionalDigits,
        ).toFloatApproximation() * slashingPercentageNumber
      ).toString();

      setToSlash(toSlash);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [config.coinMap, config.feeToken, handleError, memberEscrow, slashingPercentage]);

  if (!memberToPunish) return null;

  return (
    <>
      <AddressField>
        <TextLabel>Member to punish:</TextLabel>
        <AddressTag address={memberToPunish} />
      </AddressField>
      {kickOutMember !== undefined ? (
        <ChangedField>
          <TextLabel>
            {kickOutMember
              ? "The member WILL BE kicked out of the Trusted Circle"
              : "The member WILL NOT BE kicked out of the Trusted Circle"}
          </TextLabel>
        </ChangedField>
      ) : null}
      {slashingPercentage?.length && slashingPercentage !== "0" ? (
        <ChangedField>
          <TextLabel>{`Escrow to be slashed: ${
            parseFloat(slashingPercentage) * 100
          }% of ${memberEscrow} ${feeTokenDenom} = ${toSlash} ${feeTokenDenom}`}</TextLabel>
        </ChangedField>
      ) : null}
      {distributionList.length ? (
        <>
          <TextValue>The slashed escrow will be distributed to:</TextValue>
          <AddressList addresses={distributionList} short copyable />
        </>
      ) : (
        <TextValue>The slashed escrow will be burned</TextValue>
      )}
    </>
  );
}
