import { Coin } from "@cosmjs/stargate";
import { Dropdown, Menu, Typography } from "antd";
import gearIcon from "App/assets/icons/gear.svg";
import AddressTag from "App/components/AddressTag";
import { useEffect, useState } from "react";
import { openLeaveOcModal, useError, useOc, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { OcContractQuerier } from "utils/oversightCommunity";

import { ActionsButton, Separator, StyledOcIdActions, VotingRules, VSeparator } from "./style";

const { Title, Text } = Typography;

export default function OcIdActions(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client },
  } = useSdk();
  const {
    ocState: { ocAddress },
    ocDispatch,
  } = useOc();

  const [minimumEscrow, setMinimumEscrow] = useState<Coin>();
  const [quorum, setQuorum] = useState<string>();
  const [threshold, setThreshold] = useState<string>();
  const [votingDuration, setVotingDuration] = useState<string>();
  const [allowEndEarly, setAllowEndEarly] = useState<string>();

  useEffect(() => {
    (async function queryVotingRules() {
      if (!client) return;

      try {
        const ocContract = new OcContractQuerier(config, client);
        const ocResponse = await ocContract.getOc();
        const minimumEscrow = nativeCoinToDisplay(
          { denom: config.feeToken, amount: ocResponse.escrow_amount },
          config.coinMap,
        );
        const quorum = (parseFloat(ocResponse.rules.quorum) * 100).toFixed(2).toString();
        const threshold = (parseFloat(ocResponse.rules.threshold) * 100).toFixed(2).toString();
        const allowEndEarly = ocResponse.rules.allow_end_early ? "Yes" : "No";

        setMinimumEscrow(minimumEscrow);
        setQuorum(quorum);
        setThreshold(threshold);
        setVotingDuration(ocResponse.rules.voting_period.toString());
        setAllowEndEarly(allowEndEarly);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config, handleError]);

  return (
    <StyledOcIdActions>
      <header>
        <Title style={{ fontSize: "20px" }}>Oversight Community</Title>
        <div className="address-actions-container">
          <AddressTag address={ocAddress || ""} copyable />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => openLeaveOcModal(ocDispatch)}>
                  Leave Oversight Community
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <ActionsButton alt="Actions button" src={gearIcon} />
          </Dropdown>
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
        <VSeparator />
        <Text>
          Minimum escrow: {minimumEscrow?.amount} {minimumEscrow?.denom}
        </Text>
      </VotingRules>
    </StyledOcIdActions>
  );
}
