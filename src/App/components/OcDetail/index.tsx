import { Typography } from "antd";
import pendingIcon from "App/assets/icons/clock.svg";
import rejectedIcon from "App/assets/icons/cross.svg";
import passedIcon from "App/assets/icons/tick.svg";
import ButtonAddNew from "App/components/ButtonAddNew";
import { lazy, useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import {
  getProposalTitle,
  isOcProposalResponse,
  MixedProposalResponse,
  MixedProposalResponseId,
  OcContractQuerier,
} from "utils/oversightCommunity";
import { Cw3Status, isTcProposalResponse } from "utils/trustedCircle";

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
    title: "ID",
    dataIndex: "mixedId",
    key: "mixedId",
    width: "5%",
    sorter: (a: MixedProposalResponse, b: MixedProposalResponse) => {
      if (
        (isTcProposalResponse(a) && isTcProposalResponse(b)) ||
        (isOcProposalResponse(a) && isOcProposalResponse(b))
      )
        return a.id - b.id;

      if (a.mixedId < b.mixedId) return -1;
      if (a.mixedId > b.mixedId) return 1;

      return 0;
    },
  },
  {
    title: "Type",
    key: "title",
    width: "25%",
    render: (record: MixedProposalResponse) => getProposalTitle(record.proposal),
  },
  {
    title: "Due date",
    key: "expires",
    width: "10%",
    render: (record: MixedProposalResponse) => {
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
    sorter: (a: MixedProposalResponse, b: MixedProposalResponse) => {
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
    render: (record: MixedProposalResponse) => (
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
    sorter: (a: MixedProposalResponse, b: MixedProposalResponse) => {
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
    render: (record: MixedProposalResponse) => (
      <Paragraph ellipsis={{ rows: 4 }}>{record.description}</Paragraph>
    ),
  },
];

export default function OcDetail(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address },
  } = useSdk();

  const [isTableLoading, setTableLoading] = useState(true);
  const [isCreateProposalModalOpen, setCreateProposalModalOpen] = useState(false);

  const [proposals, setProposals] = useState<readonly MixedProposalResponse[]>([]);
  const [clickedProposal, setClickedProposal] = useState<MixedProposalResponseId>();
  const [isVotingMember, setVotingMember] = useState(false);

  const refreshProposals = useCallback(async () => {
    if (!client) return;

    try {
      const ocContract = new OcContractQuerier(config, client);
      const proposals = await ocContract.getAllMixedProposals();
      setProposals(proposals);

      const isVotingMember = (await ocContract.getAllVotingMembers()).some(
        (member) => member.addr === address,
      );
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
            rowKey={(record: MixedProposalResponse) => record.mixedId}
            onRow={(record: MixedProposalResponse) => ({
              onClick: () => setClickedProposal(record.mixedId),
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
        mixedProposalId={clickedProposal}
        refreshProposals={refreshProposals}
      />
    </>
  );
}
