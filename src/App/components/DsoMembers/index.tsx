import { Typography } from "antd";
import { DsoHomeParams } from "App/pages/DsoHome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { EscrowResponse, EscrowStatus, MemberStatus, TcContractQuerier } from "utils/trustedCircle";

import { MemberCount, MemberCounts, MembersStack } from "./style";

const { Title, Text } = Typography;

export default function DsoMembers(): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { client, address },
  } = useSdk();
  const [numVoters, setNumVoters] = useState(0);
  const [numNonVoters, setNumNonVoters] = useState(0);
  const [membership, setMembership] = useState<MemberStatus>();

  useEffect(() => {
    (async function updateNumMembers() {
      if (!client) return;

      try {
        const dsoContract = new TcContractQuerier(dsoAddress, client);
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
        const dsoContract = new TcContractQuerier(dsoAddress, client);
        const escrowResponse = await dsoContract.getEscrow(address);

        if (escrowResponse) {
          setMembership(escrowResponse.status);
        } else {
          setMembership(undefined);
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
      {membership?.leaving ? <Text>You are in the process of leaving this Trusted Circle</Text> : null}
      {membership?.pending ? (
        <Text>You need to deposit the required escrow to gain voting rights</Text>
      ) : null}
      {membership?.pending_paid ? <Text>You will become a voting member soon</Text> : null}
      <MemberCounts>
        <MemberCount>
          <Text>{numVoters}</Text>
          <Text>voting member(s)</Text>
          {membership?.voting ? <Text>(you)</Text> : null}
        </MemberCount>
        <MemberCount>
          <Text>{numNonVoters}</Text>
          <Text>non-voting member(s)</Text>
          {membership && !membership.voting ? <Text>(you)</Text> : null}
        </MemberCount>
      </MemberCounts>
    </MembersStack>
  );
}
