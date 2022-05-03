import styled from "styled-components";

export const StyledErrorFallback = styled.div`
  z-index: 1102;
  position: fixed;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
`;

export const BannerContents = styled.div`
  --margin: 1rem;
  padding: 1rem;
  overflow: auto;
  max-inline-size: calc(100% - (var(--margin) * 2));
  max-block-size: calc(100% - (var(--margin) * 2));
  max-width: 50vw;

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
    margin-left: 1rem;
    cursor: pointer;
  }
`;
