import { Typography } from "antd";
import AddressTag from "App/components/AddressTag";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { useAp } from "service/arbiterPool";
import { ApContractQuerier } from "utils/arbiterPool";

import { Separator, StyledApIdActions, VotingRules, VSeparator } from "./style";

const { Title, Text } = Typography;

export default function ApIdActions(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client },
  } = useSdk();
  const { apAddress } = useAp();

  const [quorum, setQuorum] = useState<string>();
  const [threshold, setThreshold] = useState<string>();
  const [votingDuration, setVotingDuration] = useState<string>();
  const [allowEndEarly, setAllowEndEarly] = useState<string>();

  useEffect(() => {
    (async function queryVotingRules() {
      if (!client) return;

      try {
        const apContract = new ApContractQuerier(config, client);
        const votingRules = await apContract.getVotingRules();
        const quorum = (parseFloat(votingRules.quorum) * 100).toFixed(2).toString();
        const threshold = (parseFloat(votingRules.threshold) * 100).toFixed(2).toString();
        const allowEndEarly = votingRules.allow_end_early ? "Yes" : "No";

        setQuorum(quorum);
        setThreshold(threshold);
        setVotingDuration(votingRules.voting_period.toString());
        setAllowEndEarly(allowEndEarly);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config, handleError]);

  return (
    <StyledApIdActions>
      <header>
        <Title style={{ fontSize: "20px" }}>Arbiter Pool</Title>
        <div className="address-actions-container">
          <AddressTag address={apAddress || ""} copyable />
        </div>
      </header>
      <Separator />
      <VotingRules>
        <Text>Voting rules:</Text>
        <Text>Quorum: {quorum}%</Text>
        <VSeparator />
        <Text>Threshold: {threshold}%</Text>
        <VSeparator />
        <Text>Voting duration: {votingDuration} days</Text>
        <VSeparator />
        <Text>Allow voting to end early: {allowEndEarly}</Text>
      </VotingRules>
    </StyledApIdActions>
  );
}
