import { Typography } from "antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { DsoContractQuerier, EscrowResponse, EscrowStatus } from "utils/dso";
import { DsoHomeParams } from "../../../..";
import { MembersStack } from "./style";

const { Title, Text } = Typography;

export default function Members(): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { client },
  } = useSdk();
  const [numVoters, setNumVoters] = useState(0);
  const [numNonVoters, setNumNonVoters] = useState(0);

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
        handleError(error);
      }
    })();
  }, [client, dsoAddress, handleError]);

  return (
    <MembersStack>
      <Title level={2}>Members</Title>
      <Text>Number of members with voting rights: {numVoters}</Text>
      <Text>Number of members without voting rights: {numNonVoters}</Text>
    </MembersStack>
  );
}
