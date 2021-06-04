import { Select } from "antd";
import Button from "App/components/form/Button";
import * as React from "react";
import { useState } from "react";
import { proposalLabels, ProposalStep, ProposalType } from "../..";

const { Option } = Select;

interface SelectProposalProps {
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
}

export default function SelectProposal({ setProposalStep }: SelectProposalProps): JSX.Element {
  const [selectedProposal, setSelectedProposal] = useState(ProposalType.AddParticipants);

  return (
    <>
      <Select
        defaultActiveFirstOption
        value={selectedProposal}
        onChange={(proposalType: ProposalType) => setSelectedProposal(proposalType)}
      >
        {Object.values(ProposalType).map((proposalType) => (
          <Option key={proposalType} value={proposalType}>
            {proposalLabels[proposalType]}
          </Option>
        ))}
      </Select>
      <Button onClick={() => setProposalStep({ type: selectedProposal })}>
        <div>Next</div>
      </Button>
    </>
  );
}
