import { Typography } from "antd";
import { SelectValue } from "antd/lib/select";
import { Button, Select } from "App/components/form";
import * as React from "react";
import { useState } from "react";
import { proposalLabels, ProposalStep, ProposalType } from "../..";
import { ProposalStack, Separator } from "./style";

const { Option } = Select;
const { Text } = Typography;

interface SelectProposalProps {
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
}

export default function SelectProposal({ setProposalStep }: SelectProposalProps): JSX.Element {
  const [selectedProposal, setSelectedProposal] = useState(ProposalType.AddParticipants);

  return (
    <>
      <ProposalStack gap="s-3">
        <Text>Proposal</Text>
        <Select
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
        </Select>
      </ProposalStack>
      <Separator />
      <Button onClick={() => setProposalStep({ type: selectedProposal })}>Next</Button>
    </>
  );
}
