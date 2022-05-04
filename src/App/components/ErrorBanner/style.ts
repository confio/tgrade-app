import styled from "styled-components";

export const StyledErrorBanner = styled.div`
  z-index: 1102;
  position: fixed;
  bottom: 0%;
  left: 50%;
  margin-bottom: var(--s0);
  transform: translate(-50%, 0%);
`;

export const BannerContents = styled.div`
  --margin: var(--s0);
  padding: var(--s0);
  overflow: auto;
  max-inline-size: calc(100% - (var(--margin) * 2));
  max-block-size: calc(100% - (var(--margin) * 2));
  max-width: 100%;

  background-color: hsl(0, 67%, 95%);
  border: 2px solid hsl(0, 67%, 85%);
  border-radius: 16px;

  & span.ant-typography {
    color: black;

    &:first-child {
      font-weight: 700;
    }
  }

  & img {
    height: 16px;
  }

  & img[alt="Close button"] {
    margin-left: var(--s0);
    cursor: pointer;
  }
`;
