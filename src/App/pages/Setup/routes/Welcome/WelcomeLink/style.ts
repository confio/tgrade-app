import Stack from "App/components/Stack/style";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledLink = styled(Link)`
  padding: clamp(var(--s-2), calc(2vw + var(--s-2)), var(--s2));
  border-radius: var(--border-radius);
  background-color: white;
  box-shadow: 0px 0px 1px 1px hsla(0, 0%, 0%, 0.11);

  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover,
  &:focus {
    & img[alt="Right arrow icon"] {
      visibility: visible;
    }
  }

  & > * + * {
    margin-left: clamp(var(--s-2), calc(2vw + var(--s-2)), var(--s2));
  }

  & img[alt="Right arrow icon"] {
    visibility: hidden;
    flex-basis: 100%;
    max-width: 1.25rem;
  }
`;

export const IconWrapper = styled.div`
  min-width: 3rem;
  max-width: 3rem;
  min-height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TitleStack = styled(Stack)`
  flex-basis: 100%;
  text-align: left;

  & div.ant-typography {
    font-size: var(--s0);
    color: var(--color-blue-15-59);

    & + div.ant-typography {
      font-size: var(--s1);
      font-weight: 500;
      color: var(--color-blue-14-16);
    }
  }
`;
