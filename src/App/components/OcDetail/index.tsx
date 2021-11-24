import { Typography } from "antd";
import pendingIcon from "App/assets/icons/clock.svg";
import rejectedIcon from "App/assets/icons/cross.svg";
import passedIcon from "App/assets/icons/tick.svg";
import ButtonAddNew from "App/components/ButtonAddNew";
import { lazy, useCallback, useEffect, useState } from "react";
import { useError, useOc, useSdk } from "service";
import { DsoContractQuerier, isOcProposal, ProposalResponse } from "utils/dso";

import Stack from "../Stack/style";
import { EscrowEngagementContainer, ProposalsContainer, StatusBlock, StatusParagraph } from "./style";

const OcCreateProposalModal = lazy(() => import("App/components/OcCreateProposalModal"));
const OcProposalDetailModal = lazy(() => import("App/components/OcProposalDetailModal"));
const OcIdActions = lazy(() => import("App/components/OcIdActions"));
const OcEscrow = lazy(() => import("App/components/OcEscrow"));
const OcEngagement = lazy(() => import("App/components/OcEngagement"));
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
    key: "id",
    render: (record: ProposalResponse) => {
      const proposalId = isOcProposal(record.proposal) ? `oc${record.id}` : `tc${record.id}`;
      return proposalId;
    },
    sorter: (a: ProposalResponse, b: ProposalResponse) => {
      const proposalAId = isOcProposal(a.proposal) ? `oc${a.id}` : `tc${a.id}`;
      const proposalBId = isOcProposal(b.proposal) ? `oc${b.id}` : `tc${b.id}`;

      return proposalAId < proposalBId;
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
    render: (record: any) => {
      const formatedDate = new Date(record.expires.at_time / 1000000).toLocaleDateString();
      const formatedTime = new Date(record.expires.at_time / 1000000).toLocaleTimeString();
      return (
        <>
          <div>{formatedDate}</div>
          <div>{formatedTime}</div>
        </>
      );
    },
    sorter: (a: any, b: any) => {
      const aDate = new Date(a.expires.at_time / 1000000);
      const bDate = new Date(b.expires.at_time / 1000000);
      return bDate.getTime() - aDate.getTime();
    },
  },
  {
    title: "Status",
    key: "status",
    render: (record: ProposalResponse) => (
      <StatusBlock>
        <StatusParagraph status={record.status}>
          <img alt="" {...getImgSrcFromStatus(record.status)} />
          {(record.status as string).charAt(0).toUpperCase() + (record.status as string).slice(1)}
        </StatusParagraph>
        <Paragraph>Yes: {record.votes?.yes ?? 0}</Paragraph>
        <Paragraph>No: {record.votes?.no ?? 0}</Paragraph>
        <Paragraph>Abstained: {record.votes?.abstain ?? 0}</Paragraph>
      </StatusBlock>
    ),
    sorter: (a: any, b: any) => {
      function getSortNumFromStatus(status: string): number {
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
    render: (record: any) => <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>,
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

  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);

  const [proposals, setProposals] = useState<readonly ProposalResponse[]>([]);
  const [clickedProposal, setClickedProposal] = useState<string>();
  const [isVotingMember, setVotingMember] = useState(false);

  const refreshProposals = useCallback(async () => {
    if (!ocAddress || !ocProposalsAddress || !client) return;

    try {
      const dsoContract = new DsoContractQuerier(ocAddress, client);
      const ocProposalsContract = new DsoContractQuerier(ocProposalsAddress, client);

      const dsoProposals = await dsoContract.getProposals();
      const ocProposals = await ocProposalsContract.getProposals();
      setProposals([...dsoProposals, ...ocProposals]);

      const isVotingMember = (await dsoContract.getVotingMembers()).some((member) => member.addr === address);
      setVotingMember(isVotingMember);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
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
          {proposals.length ? (
            <Table
              columns={columns}
              pagination={false}
              dataSource={proposals}
              onRow={(proposal: ProposalResponse) => ({
                onClick: () => {
                  const proposalId = isOcProposal(proposal.proposal)
                    ? `oc${proposal.id}`
                    : `tc${proposal.id}`;
                  setClickedProposal(proposalId);
                },
              })}
            />
          ) : null}
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
