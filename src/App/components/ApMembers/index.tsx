import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ApContractQuerier, EscrowResponse, EscrowStatus, MemberStatus } from "utils/arbiterPool";

import { MemberCount, MemberCounts, MembersStack } from "./style";

const { Title, Text } = Typography;

export default function ApMembers(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { client, config, address },
  } = useSdk();
  const [numVoters, setNumVoters] = useState(0);
  //const [numNonVoters, setNumNonVoters] = useState(0);
  const [membership, setMembership] = useState<MemberStatus>();

  useEffect(() => {
    (async function updateNumMembers() {
      if (!client) return;

      try {
        const ApContract = new ApContractQuerier(config, client);
        const members = await ApContract.getAllVotingMembers();

        const memberEscrowPromises = members.map(({ addr }) => ApContract.getEscrow(addr));
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
        //const numNonVoters = members.length - numVoters;

        setNumVoters(numVoters);
        //setNumNonVoters(numNonVoters);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config, handleError]);

  useEffect(() => {
    (async function queryMembership() {
      if (!client || !address) return;

      try {
        const dsoContract = new ApContractQuerier(config, client);
        const escrowResponse = await dsoContract.getEscrow(address);

        if (escrowResponse) {
          setMembership(escrowResponse.status);
        } else {
          setMembership(undefined);
        }
      } catch (error) {
        if (!(error instanceof Error)) return;
        //handleError(error);
      }
    })();
  }, [address, client]);

  return (
    <MembersStack>
      <Title level={2}>Member(s)</Title>
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
      </MemberCounts>
    </MembersStack>
  );
}
