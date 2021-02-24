import { Stack } from "App/components/layout";
import styled from "styled-components";

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s7);
  }

  h1 {
    margin: 0;
  }
`;

export const TitleAmountStack = styled(Stack)`
  & > * {
    --gap: var(--s2);
  }
`;

export const Amount = styled.div`
  span.ant-typography {
    font-size: var(--s2);
    font-family: var(--ff-iceland);
  }

  span.ant-typography + span.ant-typography {
    font-size: var(--s1);
  }
`;

export const AllowancesStack = styled(Stack)`
  & > * {
    --gap: var(--s0);
  }

  & .ant-btn-primary {
    display: flex;
    align-items: center;

    & span {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
      font-size: var(--s0);
    }
  }
`;
