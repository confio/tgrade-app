import { Dropdown, Menu, Typography } from "antd";
import { Separator } from "App/components/logic/AddDsoModal/style";
import AddressTag from "App/components/logic/AddressTag";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { getDsoName, openLeaveDsoModal, useDso } from "service/dsos";
import { DsoContract } from "utils/dso";
import { DsoHomeParams } from "../../../..";
import gearIcon from "./assets/gear.svg";
import { ActionsButton, StyledDsoIdActions, VotingRules, VSeparator } from "./style";

const { Title, Text } = Typography;

export default function DsoIdActions(): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { signingClient },
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
      try {
        const dsoResponse = await DsoContract(signingClient).use(dsoAddress).dso();
        const quorum = (parseFloat(dsoResponse.rules.quorum) * 100).toFixed(0).toString();
        const threshold = (parseFloat(dsoResponse.rules.threshold) * 100).toFixed(0).toString();

        setQuorum(quorum);
        setThreshold(threshold);
        setVotingDuration(dsoResponse.rules.voting_period.toString());
      } catch (error) {
        handleError(error);
      }
    })();
  }, [dsoAddress, handleError, signingClient]);

  return (
    <StyledDsoIdActions>
      <header>
        <Title>{dsoName}</Title>
        <div className="address-actions-container">
          <AddressTag address={dsoAddress} copyable onClose={() => console.count("close!")} />
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
