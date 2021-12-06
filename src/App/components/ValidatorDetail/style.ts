import { Modal, Table } from "antd";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  & .ant-modal-content {
    border-radius: 16px;
  }
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

export const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: solid 1px #eceef2;
  width: 400px;
  height: 125px;
`;

export const StyledInfoRow = styled.span`
  display: flex;
`;
