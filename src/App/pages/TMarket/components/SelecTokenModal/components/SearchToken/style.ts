import { Input } from "antd";
import styled from "styled-components";

export default styled(Input.Search)`
  .ant-input-wrapper {
    .ant-input-affix-wrapper:not(:last-child) {
      //   padding: 13px 0 13px 20px;
      border-radius: var(--s0) 0 0 var(--s0);
      border-right: none;
    }
    .ant-input-group-addon {
      .ant-btn {
        &.ant-btn-icon-only {
          border-left: none;
          border-radius: 0 var(--s0) var(--s0) 0;
          //   padding: 13px 20px 13px 0;
        }
      }
    }
  }
`;
