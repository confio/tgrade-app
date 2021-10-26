import { Typography } from "antd";
import { DsoHomeParams } from "App/pages/DsoHome";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { DsoContractQuerier, EscrowResponse, EscrowStatus } from "utils/dso";

import { MemberCount, MemberCounts, MembersStack } from "./style";

const { Title, Text } = Typography;

export default function Members(): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { client, address },
  } = useSdk();
  const [numVoters, setNumVoters] = useState(0);
  const [numNonVoters, setNumNonVoters] = useState(0);
  const [membership, setMembership] = useState<"voting" | "nonVoting">();

  useEffect(() => {
    (async function updateNumMembers() {
      if (!client) return;

      try {
        const dsoContract = new DsoContractQuerier(dsoAddress, client);
        const members = await dsoContract.getAllMembers();

        const memberEscrowPromises = members.map(({ addr }) => dsoContract.getEscrow(addr));
        const memberEscrowResults = await Promise.allSettled(memberEscrowPromises);
        const memberEscrowStatuses = memberEscrowResults
          .filter((res): res is PromiseFulfilledResult<EscrowResponse> => res.status === "fulfilled")
          .filter((res): res is PromiseFulfilledResult<EscrowStatus> => res.value !== null)
          .map((res) => res.value);

        let numVoters = 0;
        for (const escrow of memberEscrowStatuses) {
          if (escrow.status.voting) {
            ++numVoters;
          }
        }
        const numNonVoters = members.length - numVoters;

        setNumVoters(numVoters);
        setNumNonVoters(numNonVoters);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, dsoAddress, handleError]);

  useEffect(() => {
    (async function queryMembership() {
      if (!client || !address) return;

      try {
        const dsoContract = new DsoContractQuerier(dsoAddress, client);
        const escrowResponse = await dsoContract.getEscrow(address);

        if (escrowResponse) {
          const membership = escrowResponse.status.voting ? "voting" : "nonVoting";
          setMembership(membership);
        } else {
          setMembership("nonVoting");
        }
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, dsoAddress, handleError]);

  return (
    <MembersStack>
      <Title level={2}>Members</Title>
      <MemberCounts>
        <MemberCount>
          <Text>{numVoters}</Text>
          <Text>voting member(s)</Text>
          {membership === "voting" ? <Text>(you)</Text> : null}
        </MemberCount>
        <MemberCount>
          <Text>{numNonVoters}</Text>
          <Text>non-voting member(s)</Text>
          {membership === "nonVoting" ? <Text>(you)</Text> : null}
        </MemberCount>
      </MemberCounts>
    </MembersStack>
  );
}
