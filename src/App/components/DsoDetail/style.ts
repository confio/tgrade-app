import { Typography } from "antd";
import styled from "styled-components";

const { Paragraph } = Typography;

export const EscrowMembersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s0);
`;

export const ProposalsContainer = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: white;

  & header {
    padding: var(--s1);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  & table {
    border-top: 1px solid var(--color-border);
    color: var(--color-text-1ary);
    font-size: var(--s-1);
    font-family: var(--ff-text);
  }

  & .ant-table-row {
    cursor: pointer;
  }

  & .ant-table-cell {
    max-width: 20rem;
  }

  & .ant-table-thead .ant-table-cell {
    color: var(--color-text-2ary);
    font-size: var(--s0);
  }

  & div.ant-typography {
    color: var(--color-text-1ary);
    font-size: var(--s-1);
  }
`;

export const StatusBlock = styled.div`
  text-align: right;
`;

export const StatusParagraph = styled(Paragraph)<{ readonly status: string }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  img {
    margin-right: 3px;
  }

  &&.ant-typography {
    color: ${({ status }) => {
      switch (status) {
        case "executed":
        case "passed":
          return "#0BB0B1";
        case "rejected":
          return "#FF6465";
        default:
          return "#FFB946";
      }
    }};
  }
`;
