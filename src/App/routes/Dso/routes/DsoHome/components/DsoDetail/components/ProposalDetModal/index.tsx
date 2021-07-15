import React from "react";

import StyledDetailedProposalModal from "./style";
import {
  ModalHeader,
  Separator,
  Title,
  Text,
  ButtonGroup,
  Paragraph,
  RejectButton,
  AbstainedButton,
  AcceptButton,
  FeeWrapper,
  SectionWrapper,
  ParticipantsWrapper,
} from "./style";
import { Select } from "antd";
import { ReactComponent as AcceptIcon } from "./assets/yes-icon.svg";
import { ReactComponent as RejectIcon } from "./assets/no-icon.svg";
import { ReactComponent as AbstainIcon } from "./assets/abstain-icon.svg";
import { ReactComponent as StatusOpenIcon } from "./assets/status-open-icon.svg";
interface DetailedProposalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
}

export function DetailedProposalModal({ isModalOpen, closeModal }: DetailedProposalProps): JSX.Element {
  return (
    <StyledDetailedProposalModal
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
      width="100%"
      style={{
        maxWidth: "63.25rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{
        background: `linear-gradient(0deg, rgba(4, 119, 120, 0.9), rgba(4, 119, 120, 0.9)))`,
        backgroundSize: "cover",
      }}
    >
      <ModalHeader>
        <Title>Add non voting participant(s)</Title>
        <Text>Trusted Circle Name</Text>
      </ModalHeader>
      <Separator />
      <ParticipantsWrapper>
        <Text>Non voting participant(s) to be added</Text>
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Add Participants"
          onChange={() => {}}
        ></Select>
        <Paragraph>
          A comment which explain user the reason why these participants have to be joined the DSO.
        </Paragraph>
        <Paragraph style={{ textDecoration: "underline" }}>Link here</Paragraph>
      </ParticipantsWrapper>
      <Separator />
      <SectionWrapper>
        <Text>Progress And results</Text>
        <SectionWrapper>
          <Paragraph>
            Total voted: <b>0/0</b>
          </Paragraph>
          <Paragraph>
            Yes: <b>0</b>
          </Paragraph>
          <Paragraph>
            No: <b>0</b>
          </Paragraph>
          <Paragraph>
            Abstain: <b>0</b>
          </Paragraph>
          <Paragraph>
            Absentees: <b>0</b>
          </Paragraph>
        </SectionWrapper>
      </SectionWrapper>
      <Separator />
      <SectionWrapper>
        <Text>Voting Rules</Text>
        <SectionWrapper>
          <Paragraph>
            Quorum: <b>100%</b>
          </Paragraph>
          <Paragraph>
            {`Threshold: > `}
            <b>50%</b>
          </Paragraph>
          <Paragraph>
            Voting duration: <b>14 Days</b>
          </Paragraph>
        </SectionWrapper>
      </SectionWrapper>
      <Separator />
      <SectionWrapper>
        <StatusOpenIcon />
        <ButtonGroup>
          <FeeWrapper>
            <p>Transaction fee</p>
            <p>0.0002 TGD</p>
          </FeeWrapper>
          <AbstainedButton icon={<AbstainIcon />} onClick={closeModal}>
            Abstain
          </AbstainedButton>
          <RejectButton icon={<RejectIcon />} onClick={closeModal}>
            No
          </RejectButton>
          <AcceptButton>
            {<AcceptIcon />}
            Yes
          </AcceptButton>
        </ButtonGroup>
      </SectionWrapper>
    </StyledDetailedProposalModal>
  );
}
