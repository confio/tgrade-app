import { Typography } from "antd";
import pendingIcon from "App/assets/icons/clock.svg";
import rejectedIcon from "App/assets/icons/cross.svg";
import passedIcon from "App/assets/icons/tick.svg";
import ButtonAddNew from "App/components/ButtonAddNew";
import { lazy, useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { Cw3Status, getProposalTitle, TcContractQuerier, TcProposalResponse } from "utils/trustedCircle";

import Stack from "../Stack/style";
import { EscrowMembersContainer, ProposalsContainer, StatusBlock, StatusParagraph } from "./style";

const DsoCreateProposalModal = lazy(() => import("App/components/DsoCreateProposalModal"));
const DsoProposalDetailModal = lazy(() => import("App/components/DsoProposalDetailModal"));
const DsoIdActions = lazy(() => import("App/components/DsoIdActions"));
const DsoEscrow = lazy(() => import("App/components/DsoEscrow"));
const DsoMembers = lazy(() => import("App/components/DsoMembers"));
const Table = lazy(() => import("App/components/Table"));

const { Title, Paragraph } = Typography;

function getImgSrcFromStatus(status: string) {
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

const columns = [
  {
    title: "Nº",
    dataIndex: "id",
    key: "id",
    sorter: (a: TcProposalResponse, b: TcProposalResponse) => a.id - b.id,
  },
  {
    title: "Type",
    key: "title",
    render: (record: TcProposalResponse) => getProposalTitle(record.proposal),
  },
  {
    title: "Due date",
    key: "expires",
    render: (record: TcProposalResponse) => {
      const dateObj = new Date(parseInt(record.expires.at_time, 10) / 1000000);
      return (
        <>
          <div>{dateObj.toLocaleDateString()}</div>
          <div>{dateObj.toLocaleTimeString()}</div>
        </>
      );
    },
    sorter: (a: TcProposalResponse, b: TcProposalResponse) => {
      const aDate = new Date(parseInt(a.expires.at_time, 10) / 1000000);
      const bDate = new Date(parseInt(b.expires.at_time, 10) / 1000000);
      return bDate.getTime() - aDate.getTime();
    },
    defaultSortOrder: "ascend",
  },
  {
    title: "Status",
    key: "status",
    render: (record: TcProposalResponse) => (
      <StatusBlock>
        <StatusParagraph status={record.status}>
          <img alt="" {...getImgSrcFromStatus(record.status)} />
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </StatusParagraph>
        <Paragraph>Yes: {record.votes.yes}</Paragraph>
        <Paragraph>No: {record.votes.no}</Paragraph>
        <Paragraph>Abstained: {record.votes.abstain}</Paragraph>
      </StatusBlock>
    ),
    sorter: (a: TcProposalResponse, b: TcProposalResponse) => {
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
    render: (record: TcProposalResponse) => (
      <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>
    ),
  },
];

interface DsoDetailParams {
  readonly dsoAddress: string;
}

export default function DsoDetail({ dsoAddress }: DsoDetailParams): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { client, address },
  } = useSdk();

  const [isTableLoading, setTableLoading] = useState(true);
  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);
  const [proposals, setProposals] = useState<readonly TcProposalResponse[]>([]);
  const [clickedProposal, setClickedProposal] = useState<number>();
  const [isVotingMember, setVotingMember] = useState(false);

  const refreshProposals = useCallback(async () => {
    if (!client) return;

    try {
      const dsoContract = new TcContractQuerier(dsoAddress, client);
      const proposals = await dsoContract.getAllProposals();
      const isVotingMember = (await dsoContract.getAllVotingMembers()).some(
        (member) => member.addr === address,
      );
      setVotingMember(isVotingMember);
      setProposals(proposals);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    } finally {
      setTableLoading(false);
    }
  }, [address, client, dsoAddress, handleError]);

  useEffect(() => {
    refreshProposals();
  }, [refreshProposals]);

  return (
    <>
      <Stack>
        <DsoIdActions />
        <EscrowMembersContainer>
          <DsoEscrow />
          <DsoMembers />
        </EscrowMembersContainer>
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
            loading={isTableLoading}
            pagination={{ position: ["bottomCenter"], hideOnSinglePage: true }}
            columns={columns}
            dataSource={proposals}
            rowKey={(proposal: TcProposalResponse) => proposal.id}
            onRow={(proposal: TcProposalResponse) => ({
              onClick: () => setClickedProposal(proposal.id),
            })}
          />
        </ProposalsContainer>
      </Stack>
      <DsoCreateProposalModal
        isModalOpen={isCreateProposalModalOpen}
        closeModal={() => setCreateProposalModalOpen(false)}
        refreshProposals={refreshProposals}
      />
      <DsoProposalDetailModal
        isModalOpen={!!clickedProposal}
        closeModal={() => setClickedProposal(undefined)}
        proposalId={clickedProposal ?? 0}
        refreshProposals={refreshProposals}
      />
    </>
  );
}
