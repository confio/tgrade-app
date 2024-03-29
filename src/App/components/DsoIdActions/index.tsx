import { Coin } from "@cosmjs/stargate";
import { Dropdown, Menu, Typography } from "antd";
import gearIcon from "App/assets/icons/gear.svg";
import { Separator } from "App/components/AddDsoModal/style";
import AddressTag from "App/components/AddressTag";
import { DsoHomeParams } from "App/pages/DsoHome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { getDsoName, openLeaveDsoModal, useDso } from "service/dsos";
import { nativeCoinToDisplay } from "utils/currency";
import { TcContractQuerier } from "utils/trustedCircle";

import { ActionsButton, StyledDsoIdActions, VotingRules, VSeparator } from "./style";

const { Title, Text } = Typography;

export default function DsoIdActions(): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, client },
  } = useSdk();
  const {
    dsoState: { dsos },
    dsoDispatch,
  } = useDso();
  const dsoName = getDsoName(dsos, dsoAddress);

  const [minimumEscrow, setMinimumEscrow] = useState<Coin>();
  const [quorum, setQuorum] = useState<string>();
  const [threshold, setThreshold] = useState<string>();
  const [votingDuration, setVotingDuration] = useState<string>();
  const [allowEndEarly, setAllowEndEarly] = useState<string>();

  useEffect(() => {
    (async function queryVotingRules() {
      if (!client) return;

      try {
        const dsoContract = new TcContractQuerier(dsoAddress, client);
        const dsoResponse = await dsoContract.getTc();
        const minimumEscrow = nativeCoinToDisplay(
          { denom: config.feeToken, amount: dsoResponse.escrow_amount },
          config.coinMap,
        );
        const quorum = (parseFloat(dsoResponse.rules.quorum) * 100).toFixed(2).toString();
        const threshold = (parseFloat(dsoResponse.rules.threshold) * 100).toFixed(2).toString();
        const allowEndEarly = dsoResponse.rules.allow_end_early ? "Yes" : "No";

        setMinimumEscrow(minimumEscrow);
        setQuorum(quorum);
        setQuorum(quorum);
        setThreshold(threshold);
        setVotingDuration(dsoResponse.rules.voting_period.toString());
        setAllowEndEarly(allowEndEarly);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config.coinMap, config.feeToken, dsoAddress, handleError]);

  return (
    <StyledDsoIdActions>
      <header>
        <Title style={{ fontSize: "20px" }}>{dsoName}</Title>
        <div className="address-actions-container">
          <AddressTag address={dsoAddress} copyable />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => openLeaveDsoModal(dsoDispatch)}>
                  Leave Trusted Circle
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
    </StyledDsoIdActions>
  );
}
