import * as React from "react";
import { useEffect, useState } from "react";
import { useSdk } from "service";

interface DsoDetailParams {
  readonly dsoAddress: string;
}

export default function DsoDetail({ dsoAddress }: DsoDetailParams): JSX.Element {
  const {
    sdkState: { signingClient },
  } = useSdk();
  const [dsoQuery, setDsoQuery] = useState<any>();
  const [votingParticipantsQuery, setVotingParticipantsQuery] = useState<any>();
  const [participantsQuery, setParticipantsQuery] = useState<any>();
  const [proposalsQuery, setProposalsQuery] = useState<any>();

  useEffect(() => {
    (async function queryDso() {
      const res = await signingClient.queryContractSmart(dsoAddress, { dso: {} });
      setDsoQuery(JSON.stringify(res, null, 2));
    })();

    (async function queryVotingParticipants() {
      const res = await signingClient.queryContractSmart(dsoAddress, { list_voting_members: {} });
      setVotingParticipantsQuery(JSON.stringify(res, null, 2));
    })();

    (async function queryParticipants() {
      const res = await signingClient.queryContractSmart(dsoAddress, { list_non_voting_members: {} });
      setParticipantsQuery(JSON.stringify(res, null, 2));
    })();

    (async function queryProposals() {
      const res = await signingClient.queryContractSmart(dsoAddress, { list_proposals: {} });
      setProposalsQuery(JSON.stringify(res, null, 2));
    })();
  }, [dsoAddress, signingClient]);

  return (
    <>
      <p>DSO details:</p>
      <pre>{dsoQuery}</pre>
      <p>Voting participants:</p>
      <pre>{votingParticipantsQuery}</pre>
      <p>Non voting participants:</p>
      <pre>{participantsQuery}</pre>
      <p>Proposals:</p>
      <pre>{proposalsQuery}</pre>
    </>
  );
}
