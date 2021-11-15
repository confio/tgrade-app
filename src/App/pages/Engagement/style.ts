import PageLayout from "App/components/PageLayout";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const TxPageLayout = styled(PageLayout)`
  background-color: rgb(1, 100, 101);
`;

export const EngagementPageLayout = styled(PageLayout)`
  & main {
    margin-left: 0;
    align-items: flex-start;
  }
`;

export const TextStack = styled(Stack)`
  max-width: 80ch;
  align-items: flex-start;

  & .ant-typography {
    text-align: left;
  }
`;
