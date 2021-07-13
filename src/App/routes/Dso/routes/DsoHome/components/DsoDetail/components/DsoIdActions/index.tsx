import { Dropdown, Menu, Typography } from "antd";
import { AddressTag } from "App/components/logic";
import { Separator } from "App/components/logic/AddDsoModal/style";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { getDsoName, openLeaveDsoModal, useDso } from "service/dsos";
import { DsoContractQuerier } from "utils/dso";
import { DsoHomeParams } from "../../../..";
import gearIcon from "./assets/gear.svg";
import { ActionsButton, StyledDsoIdActions, VotingRules, VSeparator } from "./style";

const { Title, Text } = Typography;

export default function DsoIdActions(): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { client, address },
  } = useSdk();
  const {
    dsoState: { dsos },
    dsoDispatch,
  } = useDso();
  const dsoName = getDsoName(dsos, dsoAddress);

  const [quorum, setQuorum] = useState<string>();
  const [threshold, setThreshold] = useState<string>();
  const [votingDuration, setVotingDuration] = useState<string>();

  useEffect(() => {
    (async function queryVotingRules() {
      if (!client) return;

      try {
        const dsoContract = new DsoContractQuerier(dsoAddress, client);
        const dsoResponse = await dsoContract.getDso();
        const quorum = (parseFloat(dsoResponse.rules.quorum) * 100).toFixed(0).toString();
        const threshold = (parseFloat(dsoResponse.rules.threshold) * 100).toFixed(0).toString();

        setQuorum(quorum);
        setThreshold(threshold);
        setVotingDuration(dsoResponse.rules.voting_period.toString());
      } catch (error) {
        handleError(error);
      }
    })();
  }, [client, dsoAddress, handleError]);

  return (
    <StyledDsoIdActions>
      <header>
        <Title>{dsoName}</Title>
        <div className="address-actions-container">
          <AddressTag address={dsoAddress} copyable onClose={() => console.count("close!")} />
          <Dropdown
            overlay={
              <Menu>
                {address ? (
                  <Menu.Item key="1" onClick={() => openLeaveDsoModal(dsoDispatch)}>
                    Leave Trusted Circle
                  </Menu.Item>
                ) : null}
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
        <VSeparator />
        <Text>Quorum: {quorum}%</Text>
        <VSeparator />
        <Text>% of votes to be passed: {threshold}%</Text>
        <VSeparator />
        <Text>Voting duration: {votingDuration} days</Text>
      </VotingRules>
    </StyledDsoIdActions>
  );
}
