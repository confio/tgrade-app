import { Divider, List, Typography } from "antd";
import styled from "styled-components";

export default styled(List)`
  li {
    display: flex;
    flex-direction: column;
  }
  .token-item {
    cursor: pointer;
    width: 100%;
    padding: calc(var(--s0) * 0.5) var(--s0);
    column-gap: 10px;
    img {
      width: 50px;
      height: 50px;
    }
    div {
      h1 {
        &.ant-typography {
          font-size: var(--s1);
        }
      }
    }
    &:hover {
      background: var(--color-primary);
      border-radius: 3px;
      color: var(--bg-body);
    }
    &.disabled {
      opacity: 0.5;
      cursor: default;
      &:hover {
        background: transparent;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
`;

export const Title = styled(Typography.Title)`
  &.ant-typography {
    font-size: var(--s0);
    padding: 0 var(--s0);
    font-weight: 500;
    width: 100%;
    text-aling: start;
    margin: 5px 0;
  }
`;

export const StyledDivider = styled(Divider)`
  margin: 0;
`;
