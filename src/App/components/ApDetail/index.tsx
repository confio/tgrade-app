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

import ApVotingRules from "../ApVotingRules";
import Stack from "../Stack/style";
import {
  ProposalsContainer as ComplaintsContainer,
  ProposalsContainer,
  StatusBlock,
  StatusParagraph,
} from "./style";

const ApCreateProposalModal = lazy(() => import("App/components/ApCreateProposalModal"));
const ApCreateComplaintModal = lazy(() => import("App/components/ApCreateComplaintModal"));
const ApProposalDetailModal = lazy(() => import("App/components/ApProposalDetailModal"));
const ApComplaintDetailModal = lazy(() => import("App/components/ApComplaintDetailModal"));
const ArbiterPoolIdActions = lazy(() => import("App/components/ApIdActions"));
const Table = lazy(() => import("App/components/Table"));

const { Title, Paragraph } = Typography;

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

const proposalColumns = [
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
    title: "Description",
    key: "description",
    width: "45%",
    render: (record: ProposalResponse) => <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>,
  },
  {
    title: "Due date",
    key: "expires",
    width: "10%",
    render: (record: ProposalResponse) => {
      const expiryTime =
        Number(typeof record.expires === "string" ? record.expires : record.expires.at_time) / 1000000;
      const formatedDate = new Date(expiryTime).toLocaleDateString();
      const formatedTime = new Date(expiryTime).toLocaleTimeString();
      return (
        <>
          <div>{formatedDate}</div>
          <div>{formatedTime}</div>
        </>
      );
    },
    sorter: (a: ProposalResponse, b: ProposalResponse) => {
      const aExpiryTime = Number(typeof a.expires === "string" ? a.expires : a.expires.at_time) / 1000000;
      const bExpiryTime = Number(typeof b.expires === "string" ? b.expires : b.expires.at_time) / 1000000;
      return bExpiryTime - aExpiryTime;
    },
    defaultSortOrder: "ascend",
  },
  {
    title: "Status",
    key: "status",
    width: "10%",
    render: (record: ProposalResponse) => (
      <StatusBlock>
        <StatusParagraph status={record.status}>
          <img alt="" {...getImgSrcFromStatus(record.status)} />
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </StatusParagraph>
        <Paragraph>Yes: {record.votes.yes ?? 0}</Paragraph>
        <Paragraph>No: {record.votes.no ?? 0}</Paragraph>
        <Paragraph>Abstained: {record.votes.abstain ?? 0}</Paragraph>
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
    title: "Results",
    key: "results",
    width: "35%",
  },
];

const complaintColumns = [
  {
    title: "Nº",
    dataIndex: "complaint_id",
    key: "complaint_id",
    width: "5%",
    sorter: (a: Complaint, b: Complaint) => a.complaint_id - b.complaint_id,
  },
  {
    title: "Title",
    key: "title",
    width: "25%",
  },
  {
    title: "Defendant",
    key: "defendant",
    width: "10%",
  },
  {
    title: "Plaintiff",
    key: "plaintiff",
    width: "10%",
  },
  {
    title: "Description",
    key: "description",
    width: "45%",
    render: (record: Complaint) => <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>,
  },
  {
    title: "State",
    key: "state",
    width: "10%",
    render: (record: Complaint) => {
      const state = Object.keys(record.state)[0];
      const capitalizedState = state.charAt(0).toUpperCase() + state.slice(1);
      return capitalizedState;
    },
    sorter: (a: Complaint, b: Complaint) => {
      function getSortNumFromState(state: ComplaintState): number {
        switch (state) {
          case "waiting":
            return 1;
          case "initiated":
            return 2;
          case "processing":
            return 3;
          case "accepted":
            return 4;
          case "closed":
            return 5;
          case "aborted":
            return 6;
          default:
            return 7;
        }
      }

      return getSortNumFromState(b.state) - getSortNumFromState(a.state);
    },
  },
];

export default function ArbiterPoolDetail(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address },
  } = useSdk();

  const [isProposalsTableLoading, setProposalsTableLoading] = useState(true);
  const [isComplaintsTableLoading, setComplaintsTableLoading] = useState(true);
  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);
  const [isCreateComplaintModalOpen, setCreateComplaintModalOpen] = useState(false);

  const [proposals, setProposals] = useState<readonly ProposalResponse[]>([]);
  const [complaints, setComplaints] = useState<readonly Complaint[]>([]);
  const [clickedProposal, setClickedProposal] = useState<number>();
  const [clickedComplaint, setClickedComplaint] = useState<number>();
  const [isVotingMember, setVotingMember] = useState(false);

  const refreshProposals = useCallback(async () => {
    if (!client) return;

    try {
      const apContract = new ApContractQuerier(config, client);
      const proposals = await apContract.getAllProposals();
      setProposals(proposals);

      const isVotingMember = (await apContract.getAllVoters()).some((member) => member.addr === address);
      setVotingMember(isVotingMember);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    } finally {
      setProposalsTableLoading(false);
    }
  }, [address, client, config, handleError]);

  const refreshComplaints = useCallback(async () => {
    if (!client) return;

    try {
      const apContract = new ApContractQuerier(config, client);
      const complaints = await apContract.getAllComplaints();
      setComplaints(complaints);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    } finally {
      setComplaintsTableLoading(false);
    }
  }, [client, config, handleError]);

  useEffect(() => {
    refreshProposals();
    refreshComplaints();
  }, [refreshComplaints, refreshProposals]);

  return (
    <>
      <Stack style={{ width: "100%" }}>
        <ArbiterPoolIdActions />
        <ApVotingRules />
        <ProposalsContainer>
          <header>
            <Title level={2} style={{ fontSize: "var(--s1)" }}>
              Proposals
            </Title>
            {isVotingMember && (
              <ButtonAddNew text="Create proposal" onClick={() => setCreateProposalModalOpen(true)} />
            )}
          </header>
          <Table
            loading={isProposalsTableLoading}
            pagination={{ pageSize: 2, position: ["bottomCenter"], hideOnSinglePage: true }}
            columns={proposalColumns}
            dataSource={proposals}
            rowKey={(record: ProposalResponse) => record.id}
            onRow={(record: ProposalResponse) => ({
              onClick: () => setClickedProposal(record.id),
            })}
          />
        </ProposalsContainer>
        <ComplaintsContainer>
          <header>
            <Title level={2} style={{ fontSize: "var(--s1)" }}>
              Complaints
            </Title>
            <ButtonAddNew text="Register complaint" onClick={() => setCreateComplaintModalOpen(true)} />
          </header>
          <Table
            loading={isComplaintsTableLoading}
            pagination={{ pageSize: 2, position: ["bottomCenter"], hideOnSinglePage: true }}
            columns={complaintColumns}
            dataSource={complaints}
            rowKey={(record: Complaint) => record.complaint_id}
            onRow={(record: Complaint) => ({
              onClick: () => setClickedComplaint(record.complaint_id),
            })}
          />
        </ComplaintsContainer>
      </Stack>
      <ApCreateProposalModal
        isModalOpen={isCreateProposalModalOpen}
        closeModal={() => setCreateProposalModalOpen(false)}
        refreshProposals={refreshProposals}
      />
      {/* TODO Nº1: Implement this component. It should be a form that allows ApContract.registerComplaint() */}
      <ApCreateComplaintModal
        isModalOpen={isCreateComplaintModalOpen}
        closeModal={() => setCreateComplaintModalOpen(false)}
        refreshComplaints={refreshComplaints}
      />
      <ApProposalDetailModal
        isModalOpen={!!clickedProposal}
        closeModal={() => setClickedProposal(undefined)}
        proposalId={clickedProposal}
        refreshProposals={refreshProposals}
      />
      {/* TODO Nº2: Implement this component. It should be a form that shows Complaint details and allows:
      - ApContract.acceptComplaint()
      - ApContract.withdrawComplaint()
      - ApContract.renderDecision()
      */}
      <ApComplaintDetailModal
        isModalOpen={!!clickedComplaint}
        closeModal={() => setClickedComplaint(undefined)}
        proposalId={clickedComplaint}
        refreshComplaints={refreshComplaints}
      />
    </>
  );
}
