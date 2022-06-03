import styled from "styled-components";

export const StyledWarningBanner = styled.div`
  --margin: var(--s0);
  padding: var(--s0);
  overflow: auto;
  max-inline-size: calc(100% - (var(--margin) * 2));
  max-block-size: calc(100% - (var(--margin) * 2));
  max-width: 100%;

  border: 1px solid hsl(0, 2%, 89%);
  border-radius: 16px;

  & img {
    height: 20px;
  }

  & span.ant-typography {
    color: black;

    &:first-child {
      font-weight: 700;
    }
  }
`;
