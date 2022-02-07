import { Typography } from "antd";
import pendingIcon from "App/assets/icons/clock.svg";
import rejectedIcon from "App/assets/icons/cross.svg";
import passedIcon from "App/assets/icons/tick.svg";
import ButtonAddNew from "App/components/ButtonAddNew";
import { lazy, useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { CommunityPoolContractQuerier, Cw3Status, ProposalResponse } from "utils/communityPool";

import Stack from "../Stack/style";
import { ProposalsContainer, StatusBlock, StatusParagraph } from "./style";

const CPoolCreateProposalModal = lazy(() => import("App/components/CPoolCreateProposalModal"));
const CPoolProposalDetailModal = lazy(() => import("App/components/CPoolProposalDetailModal"));
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
    dataIndex: "id",
    key: "id",
    sorter: (a: ProposalResponse, b: ProposalResponse) => a.id - b.id,
  },
  {
    title: "Type",
    key: "title",
    render: () => "Send tokens",
  },
  {
    title: "Due date",
    key: "expires",
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
    title: "Description",
    key: "description",
    render: (record: ProposalResponse) => <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>,
  },
];

export default function CPoolDetail(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address },
  } = useSdk();

  const [isTableLoading, setTableLoading] = useState(true);
  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);

  const [proposals, setProposals] = useState<readonly ProposalResponse[]>([]);
  const [clickedProposal, setClickedProposal] = useState<number>();
  const [isVotingMember, setVotingMember] = useState(false);

  const refreshProposals = useCallback(async () => {
    if (!client) return;

    try {
      const cPoolContract = new CommunityPoolContractQuerier(config, client);
      const cPoolProposals = await cPoolContract.getAllProposals();
      setProposals(cPoolProposals);

      const isVotingMember = (await cPoolContract.getAllVoters()).some((member) => member.addr === address);
      setVotingMember(isVotingMember);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    } finally {
      setTableLoading(false);
    }
  }, [address, client, config, handleError]);

  useEffect(() => {
    refreshProposals();
  }, [refreshProposals]);

  return (
    <>
      <Stack style={{ width: "100%" }}>
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
            rowKey={(record: ProposalResponse) => record.id}
            onRow={(record: ProposalResponse) => ({ onClick: () => setClickedProposal(record.id) })}
          />
        </ProposalsContainer>
      </Stack>
      <CPoolCreateProposalModal
        isModalOpen={isCreateProposalModalOpen}
        closeModal={() => setCreateProposalModalOpen(false)}
        refreshProposals={refreshProposals}
      />
      <CPoolProposalDetailModal
        isModalOpen={!!clickedProposal}
        closeModal={() => setClickedProposal(undefined)}
        proposalId={clickedProposal}
        refreshProposals={refreshProposals}
      />
    </>
  );
}
