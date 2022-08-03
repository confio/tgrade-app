import { Typography } from "antd";
import pendingIcon from "App/assets/icons/clock.svg";
import rejectedIcon from "App/assets/icons/cross.svg";
import passedIcon from "App/assets/icons/tick.svg";
import ButtonAddNew from "App/components/ButtonAddNew";
import { lazy, useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import {
  ApContractQuerier,
  Complaint,
  ComplaintState,
  Cw3Status,
  getProposalTitle,
  ProposalResponse,
} from "utils/arbiterPool";

import Stack from "../Stack/style";
import {
  ProposalsContainer as ComplaintsContainer,
  ProposalsContainer,
  StateParagraph,
  StatusBlock,
} from "./style";

const ApRegisterComplaintModal = lazy(() => import("App/components/ApRegisterComplaintModal"));
const ApComplaintDetailModal = lazy(() => import("App/components/ApComplaintDetailModal"));
const ApIdActions = lazy(() => import("App/components/ApIdActions"));
const Table = lazy(() => import("App/components/Table"));

const { Title, Paragraph } = Typography;

function getImgSrcFromState(state: ComplaintState) {
  switch (state) {
    case "accepted":
      return { src: passedIcon };
    case "closed":
    case "aborted":
      return { src: rejectedIcon };
    default:
      return { src: pendingIcon };
  }
}

const complaintsColumns = [
  {
    title: "Nº",
    dataIndex: "complaint_id",
    key: "complaint_id",
    width: "5%",
    sorter: (a: Complaint, b: Complaint) => a.complaint_id - b.complaint_id,
  },
  {
    title: "Type",
    key: "title",
    width: "25%",
    render: (record: Complaint) => record.title,
  },
  {
    title: "State",
    key: "state",
    width: "10%",
    render: (record: Complaint) => (
      <StateParagraph state={Object.keys(record.state)[0]}>
        <img alt="" {...getImgSrcFromState(record.state)} />
        {Object.keys(record.state)[0].charAt(0).toUpperCase() + Object.keys(record.state)[0].slice(1)}
      </StateParagraph>
    ),
    sorter: (a: Complaint, b: Complaint) => {
      function getSortNumFromStatus(state: ComplaintState): number {
        switch (state) {
          case "accepted":
            return 1;
          case "closed":
            return 2;
          case "aborted":
            return 3;
          default:
            return 4;
        }
      }

      return getSortNumFromStatus(b.state) - getSortNumFromStatus(a.state);
    },
  },
];

function getImgSrcFromStatus(status: Cw3Status) {
  switch (status) {
    case "executed":
    case "passed":
      return { src: passedIcon };
    case "rejected":
      return { src: rejectedIcon };
    default:
      return { src: pendingIcon };
  }
}

const proposalsColumns = [
  {
    title: "Nº",
    dataIndex: "id",
    key: "id",
    width: "5%",
    sorter: (a: ProposalResponse, b: ProposalResponse) => a.id - b.id,
  },
  {
    title: "Type",
    key: "title",
    width: "25%",
    render: (record: ProposalResponse) => getProposalTitle(record.proposal),
  },
  {
    title: "Due date",
    key: "expires",
    width: "10%",
    render: (record: ProposalResponse) => {
      const dateObj = new Date(parseInt(record.expires.at_time, 10) / 1000000);
      return (
        <>
          <div>{dateObj.toLocaleDateString()}</div>
          <div>{dateObj.toLocaleTimeString()}</div>
        </>
      );
    },
    sorter: (a: ProposalResponse, b: ProposalResponse) => {
      const aDate = new Date(parseInt(a.expires.at_time, 10) / 1000000);
      const bDate = new Date(parseInt(b.expires.at_time, 10) / 1000000);
      return bDate.getTime() - aDate.getTime();
    },
    defaultSortOrder: "ascend",
  },
  {
    title: "Status",
    key: "status",
    width: "10%",
    render: (record: ProposalResponse) => (
      <StatusBlock>
        <StateParagraph state={record.status}>
          <img alt="" {...getImgSrcFromStatus(record.status)} />
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </StateParagraph>
        <Paragraph>Yes: {record.votes.yes}</Paragraph>
        <Paragraph>No: {record.votes.no}</Paragraph>
        <Paragraph>Abstained: {record.votes.abstain}</Paragraph>
      </StatusBlock>
    ),
    sorter: (a: ProposalResponse, b: ProposalResponse) => {
      function getSortNumFromStatus(status: Cw3Status): number {
        switch (status) {
          case "executed":
            return 1;
          case "passed":
            return 2;
          case "rejected":
            return 3;
          default:
            return 4;
        }
      }

      return getSortNumFromStatus(b.status) - getSortNumFromStatus(a.status);
    },
  },
  {
    title: "Description",
    key: "description",
    render: (record: ProposalResponse) => <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>,
  },
];

export default function ApDetail(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address },
  } = useSdk();

  const [isComplaintsTableLoading, setComplaintsTableLoading] = useState(true);
  const [isProposalsTableLoading, setProposalsTableLoading] = useState(true);
  const [isRegisterComplaintModalOpen, setRegisterComplaintModalOpen] = useState(false);
  const [, setCreateProposalModalOpen] = useState(false);

  const [complaints, setComplaints] = useState<readonly Complaint[]>([]);
  const [proposals, setProposals] = useState<readonly ProposalResponse[]>([]);
  const [clickedComplaint, setClickedComplaint] = useState<number>();
  const [, setClickedProposal] = useState<number>();
  const [isVotingMember, setVotingMember] = useState(false);

  const refreshComplaints = useCallback(async () => {
    if (!client) return;

    try {
      const apContract = new ApContractQuerier(config, client);
      const complaints = await apContract.getAllComplaints();
      console.log({ complaints });
      setComplaints(complaints);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    } finally {
      setComplaintsTableLoading(false);
    }
  }, [client, config, handleError]);

  const refreshProposals = useCallback(async () => {
    if (!client) return;

    try {
      const apContract = new ApContractQuerier(config, client);
      const proposals = await apContract.getAllProposals();
      setProposals(proposals);

      const isVotingMember = (await apContract.getAllVoters()).some((voter) => voter.addr === address);
      setVotingMember(isVotingMember);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    } finally {
      setProposalsTableLoading(false);
    }
  }, [address, client, config, handleError]);

  useEffect(() => {
    refreshComplaints();
    refreshProposals();
  }, [refreshComplaints, refreshProposals]);

  return (
    <>
      <Stack style={{ width: "100%" }}>
        <ApIdActions />
        <ComplaintsContainer>
          <header>
            <Title level={2} style={{ fontSize: "var(--s1)" }}>
              Complaints
            </Title>
            {isVotingMember && (
              <ButtonAddNew text="Register complaint" onClick={() => setRegisterComplaintModalOpen(true)} />
            )}
          </header>
          <Table
            loading={isComplaintsTableLoading}
            pagination={{ position: ["bottomCenter"], hideOnSinglePage: true }}
            columns={complaintsColumns}
            dataSource={complaints}
            rowKey={(record: Complaint) => record.complaint_id}
            onRow={(record: Complaint) => ({
              onClick: () => setClickedComplaint(record.complaint_id),
            })}
          />
        </ComplaintsContainer>
        <ProposalsContainer>
          <header>
            <Title level={2} style={{ fontSize: "var(--s1)" }}>
              Proposals
            </Title>
            {isVotingMember && (
              <ButtonAddNew text="Add proposal" onClick={() => setCreateProposalModalOpen(true)} />
            )}
          </header>
          <Table
            loading={isProposalsTableLoading}
            pagination={{ position: ["bottomCenter"], hideOnSinglePage: true }}
            columns={proposalsColumns}
            dataSource={proposals}
            rowKey={(record: ProposalResponse) => record.id}
            onRow={(record: ProposalResponse) => ({
              onClick: () => setClickedProposal(record.id),
            })}
          />
        </ProposalsContainer>
      </Stack>
      <ApRegisterComplaintModal
        isModalOpen={isRegisterComplaintModalOpen}
        closeModal={() => setRegisterComplaintModalOpen(false)}
        refreshComplaints={refreshComplaints}
      />
      <ApComplaintDetailModal
        isModalOpen={clickedComplaint !== undefined}
        closeModal={() => setClickedComplaint(undefined)}
        complaintId={clickedComplaint}
        refreshComplaints={refreshComplaints}
      />
    </>
  );
}
