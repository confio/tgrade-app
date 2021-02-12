import { Stack } from "App/components/layout";
import styled from "styled-components";

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s4);
  }

  h1 {
    margin: 0;
  }

  .ant-transfer {
    width: 100%;

    & > *:first-child {
      width: 100%;
    }

    & > *:not(:first-child) {
      display: none;
    }

    .ant-transfer-list {
      height: auto;
      max-height: 300px;
    }

    .ant-transfer-list-content-item-text {
      text-align: left;
    }
  }
`;
