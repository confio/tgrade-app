import { Stack } from "App/components/layoutPrimitives";
import styled from "styled-components";

export default styled.header`
  width: clamp(min(30rem, 100%), 80%, 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const TitleStack = styled(Stack)`
  display: flex;

  h3.ant-typography,
  h2.ant-typography {
    text-align: right;
    font-size: var(--s0);
    font-weight: 400;
  }

  h2.ant-typography {
    color: var(--color-text-2ary);
  }
`;
