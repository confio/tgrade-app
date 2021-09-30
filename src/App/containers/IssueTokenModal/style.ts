import { Modal } from "antd";
import styled from "styled-components";

export default styled(Modal)`
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
