import { Modal, Tag } from "antd";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  & .ant-modal-content {
    background: none;
    box-shadow: none;
    border-radius: 16px;
  }

  & .ant-btn {
    align-self: flex-end;
  }
`;

export const TxHashContainer = styled.div`
  display: flex;
  align-items: center;

  & img {
    cursor: pointer;
    height: 12px;
  }
`;

export const StyledTag = styled(Tag)`
  background: transparent;
  border: none;
  color: white;
  font-size: var(--s-1);
`;
