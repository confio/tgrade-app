import { Typography } from "antd";
import { SelectValue } from "antd/lib/select";
import { ReactComponent as DownArrow } from "App/assets/icons/down-arrow.svg";
import Button from "App/components/Button";
import Select from "App/components/Select";
import * as React from "react";
import { useState } from "react";

import { proposalLabels, ProposalStep, ProposalType } from "../..";
import { ProposalStack, Separator, StyledSelect } from "./style";

const { Option } = Select;
const { Text } = Typography;

interface SelectProposalProps {
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
}

export default function SelectProposal({ setProposalStep }: SelectProposalProps): JSX.Element {
  const [selectedProposal, setSelectedProposal] = useState(ProposalType.SendTokens);

  return (
    <>
      <ProposalStack gap="s-3">
        <Text>Proposal</Text>
        <StyledSelect
          suffixIcon={<DownArrow />}
          defaultActiveFirstOption
          size="large"
          value={selectedProposal}
          onChange={(proposalType: SelectValue) => setSelectedProposal(proposalType as ProposalType)}
        >
          {Object.values(ProposalType).map((proposalType) => (
            <Option key={proposalType} value={proposalType}>
              {proposalLabels[proposalType]}
            </Option>
          ))}
        </StyledSelect>
      </ProposalStack>
      <Separator />
      <Button onClick={() => setProposalStep({ type: selectedProposal })}>Next</Button>
    </>
  );
}
