import PageLayout from "App/components/PageLayout";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const NotFoundPageLayout = styled(PageLayout)`
  background-color: white;
`;

export const NotFoundStack = styled(Stack)`
  & img {
    margin: 0 auto;
    width: 300px;
  }

  & .ant-typography {
    color: var(--color-primary);
    font-weight: 500;
  }

  & h1.ant-typography {
    font-size: var(--s7);
  }

  & h2.ant-typography {
    font-size: var(--s3);
    text-transform: uppercase;
  }

  & span.ant-typography {
    font-size: var(--s1);
  }

  & button {
    align-self: center;
  }
`;
