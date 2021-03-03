import * as styled from "styled-components";

export const Forms = styled.createGlobalStyle`
  .ant-form {
    div[role="alert"] li {
      color: var(--color-error-form);
      font-size: var(--s-1);
      text-align: left;
      margin: var(--s-1);

      &::before {
        content: "* ";
      }
    }

    .ant-form-item-has-error {
      color: var(--color-error-form);

      & .ant-input:not(.ant-form-item-has-error .ant-input-disabled) {
        background: none;
      }

      .ant-input-group,
      .ant-form-item-control-input-content {
        color: currentColor;
        border: var(--border-width) solid currentColor;

        &:focus-within {
          color: currentColor;
          border: var(--border-width) solid currentColor;
        }
      }
    }

    .ant-input,
    .ant-form-item-has-error .ant-input {
      background: none;

      &:focus {
        border-radius: var(--border-radius);
      }
    }

    .ant-input-group,
    .ant-form-item-control-input-content,
    .ant-transfer-list-body-search-wrapper {
      color: var(--color-form);
      border: var(--border-width) solid currentColor;
      border-radius: var(--border-radius);

      &:hover {
        color: var(--color-hover);
        border: var(--border-width) solid var(--color-hover);
      }

      &:focus-within {
        color: var(--color-form-focus);
        border: var(--border-width) solid var(--color-form-focus);
      }
    }

    .ant-form-item {
      margin-top: 0;
      margin-bottom: 0;

      &[data-disabled="true"] {
        .ant-form-item-control-input-content {
          color: var(--color-form-disabled);
          background-color: var(--color-form-disabled-bg);
          border-color: var(--color-form-disabled-bg);
        }
      }
    }

    .ant-transfer-list-body-search-wrapper:hover .anticon-search svg {
      color: var(--color-hover);
    }

    .ant-transfer-list-body-search-wrapper:focus-within .anticon-search svg {
      color: var(--color-form-focus);
    }

    .ant-input-search-enter-button input + .ant-input-group-addon {
      border-left: var(--border-width) solid;
    }

    .ant-input-group-addon {
      background: none;
      color: currentColor;

      & .ant-input-search-button,
      & .anticon-search {
        transition: all 0.3s ease, 0s;
      }
    }

    .ant-input,
    .ant-select-selector.ant-select-selector {
      min-height: 4rem;
      text-overflow: ellipsis;
      background: none;
      border: none;
      color: currentColor;

      &::placeholder {
        color: currentColor;
      }
    }

    .ant-select,
    .ant-select-open,
    .ant-select-selection-search,
    .ant-select-selection-item {
      color: var(--color-form);

      &:hover {
        color: var(--color-hover);
      }

      &:focus-within {
        color: var(--color-form-focus);
      }

      & .ant-select-arrow {
        color: currentColor;
      }
    }

    .ant-select-selection-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ant-input-search-button {
      width: auto;
      min-height: 4rem;

      background: none;
      color: currentColor;

      &::after {
        display: none;
      }

      &:focus,
      &:focus:hover {
        background: none;
        border: var(--border-width) solid transparent;
      }
    }

    .ant-transfer-list {
      border: none;
      color: var(--color-primary);

      .ant-transfer-list-header {
        background: none;
        border-bottom: var(--border-width) solid var(--color-form);

        span {
          color: var(--color-text);
        }
      }

      .ant-transfer-list-body-search-wrapper {
        margin: 0.625rem;
      }

      .ant-input {
        min-height: 0;
      }

      .ant-transfer-list-search-action svg {
        color: var(--color-primary);
      }

      .ant-checkbox-checked .ant-checkbox-inner {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
      }

      .ant-checkbox-indeterminate .ant-checkbox-inner::after {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
      }

      .ant-transfer-list-content-item,
      .ant-transfer-list-content-item-checked {
        background: none;

        &:hover {
          background: none;
          color: var(--color-hover);
        }
      }

      .ant-empty-description {
        color: var(--color-error-form);
      }
    }
  }
`;
