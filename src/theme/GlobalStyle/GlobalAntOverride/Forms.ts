import * as styled from "styled-components";

export const Forms = styled.createGlobalStyle`
  /* Form field */
  .ant-form-item {
    margin-top: 0;
    margin-bottom: 0;

    /* Form field with validation error */
    &.ant-form-item-has-error {
      color: var(--color-error-form);

      /* Error input field and search */
      & .ant-form-item-control-input-content,
      & .ant-input-group {
        color: currentColor;

        &:hover {
          color: var(--color-hover);
        }

        &:focus-within {
          color: var(--color-form-focus);
        }
      }

      /* Error message */
      & .ant-form-item-explain-error li {
        margin: var(--s-1);

        color: currentColor;
        font-size: var(--s-1);
        text-align: left;

        &::before {
          content: "* ";
        }
      }
    }

    /* Disabled form field */
    &&[data-disabled="true"] {
      & .ant-form-item-control-input-content {
        color: var(--color-form-disabled);
        background-color: var(--color-form-disabled-bg);
        border-color: var(--color-form-disabled-bg);
      }
    }

    /* Input field, search, and transfer */
    & .ant-form-item-control-input-content,
    & .ant-input-group,
    & .ant-transfer-list-body-search-wrapper {
      color: var(--color-form);
      border: var(--border-width) solid currentColor;
      border-radius: var(--border-radius);

      &:hover {
        color: var(--color-hover);
      }

      &:focus-within {
        color: var(--color-form-focus);
      }

      & .ant-input,
      & .ant-select-selector.ant-select-selector {
        min-height: 4rem;
        border: none;
        color: currentColor;
        background: none;
        text-overflow: ellipsis;

        &:focus {
          border-radius: var(--border-radius);
        }

        &::placeholder {
          color: currentColor;
        }
      }
    }

    /* Input for search bar */
    & .ant-input-search .ant-input-group .ant-input-group-addon {
      color: currentColor;
      background: none;
      border-left: var(--border-width) solid currentColor;

      & .ant-input-search-button,
      & .anticon-search {
        transition: all 0.3s ease, 0s;
      }

      & .ant-input-search-button {
        width: auto;
        min-height: 4rem;

        color: currentColor;
        background: none;

        &::after {
          display: none;
        }

        &:focus,
        &:focus:hover {
          background: none;
          border: var(--border-width) solid transparent;
        }
      }
    }

    /* Input for transfer */
    & .ant-transfer-list {
      color: var(--color-primary);
      border: none;

      & .ant-transfer-list-header {
        background: none;
        border-bottom: var(--border-width) solid var(--color-form);

        span {
          color: var(--color-text);
        }
      }

      & .ant-transfer-list-body-search-wrapper {
        margin: 0.625rem;

        & .anticon-search svg {
          color: var(--color-primary);
        }

        &:hover .anticon-search svg {
          color: var(--color-hover);
        }

        &:focus-within .anticon-search svg {
          color: var(--color-form-focus);
        }
      }

      & .ant-input {
        min-height: 0;
      }

      & .ant-checkbox-checked .ant-checkbox-inner {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
      }

      & .ant-checkbox-indeterminate .ant-checkbox-inner::after {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
      }

      & .ant-transfer-list-content-item,
      & .ant-transfer-list-content-item-checked {
        background: none;

        &:hover {
          color: var(--color-hover);
          background: none;
        }
      }

      & .ant-empty-description {
        color: var(--color-error-form);
      }
    }

    /* Input for select */
    & .ant-select {
      color: var(--color-form);

      &:hover {
        color: var(--color-hover);
      }

      &:focus-within {
        color: var(--color-form-focus);
      }

      & .ant-select-selector,
      & .ant-select-selection-item {
        transition: all 0.3s ease, 0s;
      }

      & .ant-select-selection-item {
        display: flex;
        align-items: center;
        justify-content: center;

        color: currentColor;
      }

      & .ant-select-arrow {
        color: currentColor;
      }
    }
  }
`;
