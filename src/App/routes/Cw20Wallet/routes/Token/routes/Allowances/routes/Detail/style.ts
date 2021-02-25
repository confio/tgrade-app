import { Stack } from "App/components/layout";
import styled from "styled-components";

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s3);
  }

  h1 {
    margin: 0;
  }

  & > span.ant-typography {
    font-size: var(--s0);
    font-family: var(--ff-iceland);
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
