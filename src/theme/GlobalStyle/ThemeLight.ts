import * as styled from "styled-components";

export const ThemeLight = styled.createGlobalStyle`
  :root {
    --color-primary: var(--color-green-88-37);
    --color-text-1ary: var(--color-blue-14-16);
    --color-text-2ary: var(--color-blue-15-59);

    --color-border: var(--color-blue-12-90);

    --color-result-success: var(--color-green-63-42);
    --color-result-failure: var(--color-red-100-70);

    --color-error-alert: var(--color-red-100-70);
    --color-error-form: var(--color-red-100-70);

    --color-hover: var(--color-yellow-91-73);

    --color-button-primary-bg: var(--color-gray-0-12);
    --color-button-disabled: var(--color-gray-0-51);
    --color-button-disabled-bg: var(--color-gray-0-20);

    --color-input-border: var(--color-border);
    --color-input-label-bg: var(--color-gray-0-98);

    --color-form: var(--color-blue-30-38);
    --color-form-focus: var(--color-blue-100-74);
    --color-form-disabled: var(--color-gray-0-51);
    --color-form-disabled-bg: var(--color-gray-0-20);

    --bg-body: var(--color-gray-0-98);
    --grad-primary: var(--grad-2);
    --bg-button-1ary: var(--color-green-88-37);
    --bg-button-1ary-focus: var(--color-green-88-37);
    --color-button-2ary: var(--color-blue-15-59);
    --color-button-2ary-selected: var(--color-blue-14-16);
    --border-button-2ary: var(--color-blue-15-59);
    --border-button-2ary-selected: var(--color-blue-14-16);
    --bg-button-2ary: var(--color-gray-0-98);
    --bg-button-2ary-focus: var(--color-blue-15-59);
    --bg-button-danger: var(--color-red-100-70);
    --bg-button-default: var(--grad-4);
    --bg-button-default-focus: var(--grad-5);
    --bg-button-large: var(--grad-6);
    --bg-button-large-focus: var(--grad-5);
  }
`;
