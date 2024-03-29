import * as styled from "styled-components";

export const Buttons = styled.createGlobalStyle`
  .ant-btn-primary,
  .ant-btn-default {
    align-self: center;

    width: min(13.625rem, var(--max-width, 999rem));
    min-height: 2.75rem;
    height: auto;

    border-color: transparent;
    border-width: var(--border-width);
    border-radius: 1.375rem;

    white-space: normal;
    font-family: var(--ff-montserrat);
    font-size: var(--s-1);

    &:hover {
      color: var(--color-hover);
      border-color: transparent;
    }

    &:disabled,
    &:disabled:hover {
      color: var(--color-button-disabled);
      background-color: var(--color-button-disabled-bg);
      border-color: var(--color-button-disabled-bg);

      &::after {
        display: none;
      }
    }
  }

  .ant-btn-primary,
  .ant-btn-primary:hover {
    position: relative;

    background-color: var(--color-button-primary-bg);
    background-clip: padding-box;

    &::after {
      content: "";
      z-index: -1;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      margin: calc(-1 * var(--border-width));
      border-radius: inherit;

      background: var(--bg-button-1ary);
    }
  }

  .ant-btn-primary:focus,
  .ant-btn-primary:focus:hover {
    background: var(--bg-button-1ary-focus);
    border: none;

    &::after {
      display: none;
    }
  }

  .ant-btn-default,
  .ant-btn-default:hover {
    background: var(--bg-button-default);
    border: none;
  }

  .ant-btn-default,
  .ant-btn-default:focus {
    color: white;
  }

  .ant-btn-default:focus,
  .ant-btn-default:focus:hover {
    background: var(--bg-button-default-focus);
    border: none;
  }

  .ant-btn-default:focus:hover {
    color: var(--color-hover);
  }

  .ant-btn-primary[data-size="large"] {
    width: 100%;
    min-height: var(--s6);
    height: auto;

    border: var(--border-width);
    border-radius: var(--border-radius);

    color: white;
    background: var(--bg-button-large);
    white-space: normal;
    font-family: var(--ff-iceland);
    font-size: var(--s2);

    &:hover {
      color: var(--color-hover);
    }

    &:focus {
      background: var(--bg-button-large-focus);
    }

    &:disabled,
    &:disabled:hover {
      color: var(--color-button-disabled);
      background: none;
      background-color: var(--color-button-disabled-bg);
    }

    &::after {
      display: none;
    }

    & span.ant-typography {
      color: inherit;
      font-family: inherit;
      font-size: inherit;
    }
  }
`;
