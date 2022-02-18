import { Decimal } from "@cosmjs/math";
import AddressList from "App/components/AddressList";
import AddressTag from "App/components/AddressTag";
import { DsoHomeParams } from "App/pages/DsoHome";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useError, useSdk } from "service";
import { isValidAddress } from "utils/forms";
import { Punishment, TcContractQuerier } from "utils/trustedCircle";

import { AddressField, ChangedField, TextLabel, TextValue } from "../style";

interface ProposalPunishVotingMemberProps {
  readonly proposalPunishVotingMember: Punishment | undefined;
}

export default function ProposalPunishVotingMember({
  proposalPunishVotingMember,
}: ProposalPunishVotingMemberProps): JSX.Element | null {
  const memberToPunish =
    proposalPunishVotingMember?.burn_escrow?.member || proposalPunishVotingMember?.distribute_escrow?.member;

  const kickOutMember =
    proposalPunishVotingMember?.burn_escrow?.kick_out ||
    proposalPunishVotingMember?.distribute_escrow?.kick_out;

  const slashingPercentage =
    proposalPunishVotingMember?.burn_escrow?.slashing_percentage ||
    proposalPunishVotingMember?.distribute_escrow?.slashing_percentage;

  const distributionList = proposalPunishVotingMember?.distribute_escrow?.distribution_list ?? [];

  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, client },
  } = useSdk();
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  const [memberEscrow, setMemberEscrow] = useState("0");
  const [toSlash, setToSlash] = useState("0");

  useEffect(() => {
    (async function updateMemberEscrow() {
      if (!client || !memberToPunish) return;

      if (!isValidAddress(memberToPunish, config.addressPrefix)) {
        setMemberEscrow("0");
        return;
      }

      const dsoContract = new TcContractQuerier(dsoAddress, client);

      try {
        const escrowResponse = await dsoContract.getEscrow(memberToPunish);
        if (!escrowResponse) throw new Error("No escrow found for user");

        const decimals = config.coinMap[config.feeToken].fractionalDigits;
        const userEscrowDecimal = Decimal.fromAtomics(escrowResponse.paid, decimals);
        setMemberEscrow(userEscrowDecimal.toString());
      } catch {
        setMemberEscrow("0");
      }
    })();
  }, [client, config.addressPrefix, config.coinMap, config.feeToken, dsoAddress, memberToPunish]);

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
