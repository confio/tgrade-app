import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ApContractQuerier } from "utils/arbiterPool";

import { VotingRules, VSeparator } from "./style";

const { Text } = Typography;

export default function ApVotingRules(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client },
  } = useSdk();

  const [quorum, setQuorum] = useState<string>();
  const [threshold, setThreshold] = useState<string>();
  const [votingDuration, setVotingDuration] = useState<string>();
  const [allowEndEarly, setAllowEndEarly] = useState<string>();

  useEffect(() => {
    (async function queryVotingRules() {
      if (!client) return;

      try {
        const apContract = new ApContractQuerier(config, client);
        /*        const apResponse = await apContract.getOc();
        const quorum = (parseFloat(apResponse.rules.quorum) * 100).toFixed(2).toString();
        const threshold = (parseFloat(apResponse.rules.threshold) * 100).toFixed(2).toString();
        const allowEndEarly = apResponse.rules.allow_end_early ? "Yes" : "No";*/

        setQuorum(quorum);
        setQuorum(quorum);
        setThreshold(threshold);
        //setVotingDuration(apResponse.rules.voting_period.toString());
        setAllowEndEarly(allowEndEarly);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config, handleError]);

  return (
    <>
      <VotingRules>
        <Text>Voting rules:</Text>
        <Text>Quorum: {quorum}%</Text>
        <VSeparator />
        <Text>Threshold: {threshold}%</Text>
        <VSeparator />
        <Text>Voting duration: {votingDuration} days</Text>
        <VSeparator />
        <Text>Early passing: {allowEndEarly}</Text>
        <VSeparator />
      </VotingRules>
    </>
  );
}
