import { Typography } from "antd";
import pendingIcon from "App/assets/icons/clock.svg";
import rejectedIcon from "App/assets/icons/cross.svg";
import passedIcon from "App/assets/icons/tick.svg";
import ButtonAddNew from "App/components/ButtonAddNew";
import { lazy, useCallback, useEffect, useState } from "react";
import { useError, useOc, useSdk } from "service";
import { Cw3Status, DsoContractQuerier, DsoProposalResponse, isDsoProposal, isOcProposal } from "utils/dso";
import { OcProposalResponse } from "utils/oc";

import Stack from "../Stack/style";
import { EscrowEngagementContainer, ProposalsContainer, StatusBlock, StatusParagraph } from "./style";

const OcCreateProposalModal = lazy(() => import("App/components/OcCreateProposalModal"));
const OcProposalDetailModal = lazy(() => import("App/components/OcProposalDetailModal"));
const OcIdActions = lazy(() => import("App/components/OcIdActions"));
const OcEscrow = lazy(() => import("App/components/OcEscrow"));
const OcEngagement = lazy(() => import("App/components/OcEngagement"));
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

const columns = [
  {
    title: "Nº",
    key: "id",
    render: (record: DsoProposalResponse | OcProposalResponse) => {
      const proposalId = isOcProposal(record) ? `oc${record.id}` : `tc${record.id}`;
      return proposalId;
    },
    sorter: (a: DsoProposalResponse | OcProposalResponse, b: DsoProposalResponse | OcProposalResponse) => {
      if ((isDsoProposal(a) && isDsoProposal(b)) || (isOcProposal(a) && isOcProposal(b))) return a.id - b.id;

      const proposalAId = isOcProposal(a) ? `oc${a.id}` : `tc${a.id}`;
      const proposalBId = isOcProposal(b) ? `oc${b.id}` : `tc${b.id}`;

      if (proposalAId < proposalBId) return -1;
      if (proposalAId > proposalBId) return 1;

      return 0;
    },
  },
  {
    title: "Type",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Due date",
    key: "expires",
    render: (record: DsoProposalResponse | OcProposalResponse) => {
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
    sorter: (a: DsoProposalResponse | OcProposalResponse, b: DsoProposalResponse | OcProposalResponse) => {
      const aExpiryTime = Number(typeof a.expires === "string" ? a.expires : a.expires.at_time) / 1000000;
      const bExpiryTime = Number(typeof b.expires === "string" ? b.expires : b.expires.at_time) / 1000000;
      return bExpiryTime - aExpiryTime;
    },
    defaultSortOrder: "ascend",
  },
  {
    title: "Status",
    key: "status",
    render: (record: DsoProposalResponse | OcProposalResponse) => (
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
    sorter: (a: DsoProposalResponse | OcProposalResponse, b: DsoProposalResponse | OcProposalResponse) => {
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
    render: (record: DsoProposalResponse | OcProposalResponse) => (
      <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>
    ),
  },
];

export default function OcDetail(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { client, address },
  } = useSdk();
  const {
    ocState: { ocAddress, ocProposalsAddress },
  } = useOc();

  const [isTableLoading, setTableLoading] = useState(true);
  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);

  const [proposals, setProposals] = useState<ReadonlyArray<DsoProposalResponse | OcProposalResponse>>([]);
  const [clickedProposal, setClickedProposal] = useState<string>();
  const [isVotingMember, setVotingMember] = useState(false);

  const refreshProposals = useCallback(async () => {
    if (!ocAddress || !ocProposalsAddress || !client) return;

    try {
      const dsoContract = new DsoContractQuerier(ocAddress, client);
      const ocProposalsContract = new DsoContractQuerier(ocProposalsAddress, client);

      const dsoProposals = await dsoContract.getAllProposals();
      // FIXME: the OC contract needs its own queries class with different types
      const ocProposals = await ocProposalsContract.getAllProposals();
      setProposals([...dsoProposals, ...ocProposals]);

      const isVotingMember = (await dsoContract.getAllVotingMembers()).some(
        (member) => member.addr === address,
      );
      setVotingMember(isVotingMember);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    } finally {
      setTableLoading(false);
    }
  }, [address, client, handleError, ocAddress, ocProposalsAddress]);

  useEffect(() => {
    refreshProposals();
  }, [refreshProposals]);

  return (
    <>
      <Stack style={{ width: "100%" }}>
        <OcIdActions />
        <EscrowEngagementContainer>
          <OcEscrow />
          <OcEngagement />
        </EscrowEngagementContainer>
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
            rowKey={(record: DsoProposalResponse | OcProposalResponse) =>
              isOcProposal(record) ? `oc${record.id}` : `tc${record.id}`
            }
            onRow={(record: DsoProposalResponse | OcProposalResponse) => ({
              onClick: () => {
                const proposalId = isOcProposal(record) ? `oc${record.id}` : `tc${record.id}`;
                setClickedProposal(proposalId);
              },
            })}
          />
        </ProposalsContainer>
      </Stack>
      <OcCreateProposalModal
        isModalOpen={isCreateProposalModalOpen}
        closeModal={() => setCreateProposalModalOpen(false)}
        refreshProposals={refreshProposals}
      />
      <OcProposalDetailModal
        isModalOpen={!!clickedProposal}
        closeModal={() => setClickedProposal(undefined)}
        proposalId={clickedProposal}
        refreshProposals={refreshProposals}
      />
    </>
  );
}
