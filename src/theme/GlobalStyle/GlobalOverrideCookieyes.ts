import * as styled from "styled-components";

/*
    This component uses "!important" when the library uses a style
    tag that cannot be overriden otherwise.
*/

export const GlobalOverrideCookieyes = styled.createGlobalStyle`
  & .cky-btn-accept {
    background-color: var(--color-primary) !important;
    border-color: var(--color-primary) !important;
  }

  & .cky-tab-title > .cky-switch > input:checked + .cky-slider {
    background-color: var(--color-primary);
  }

  & .cky-btn-custom-accept {
    color: var(--color-primary) !important;
    border-color: var(--color-primary) !important;
  }
`;
