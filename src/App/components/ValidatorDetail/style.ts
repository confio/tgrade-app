import { Modal, Table } from "antd";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  border-radius: 16px;
  & .ant-modal-content {
    border-radius: 16px;
  }

  ${({ bgTransparent }: { bgTransparent?: boolean }) =>
    bgTransparent &&
    `
  & .ant-modal-content {
    background: none;
    box-shadow: none;
  }
  `};
`;

export const Title = styled.p`
  font-family: Quicksand;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
`;
export const StyledTable = styled(Table)`
  .ant-table-column-title {
    position: relative;
    z-index: 1;
    flex: 1 1;
    font-family: Quicksand;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
  }

  .ant-table-container table > thead {
    height: 5px;
  }
  .ant-table-tbody > tr > td {
    font-family: Quicksand;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
  }
`;
