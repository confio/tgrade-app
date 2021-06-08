import * as styled from "styled-components";

export const ThemeDark = styled.createGlobalStyle`
  :root {
    --color-primary: var(--color-green-88-37);
    --color-text-1ary: white;
    --color-text-2ary: var(--color-blue-15-59);

    --color-result-success: var(--color-green-63-42);
    --color-result-failure: var(--color-red-100-70);

    --color-error-alert: var(--color-red-100-70);
    --color-error-form: var(--color-red-100-70);

    --color-hover: var(--color-yellow-91-73);

    --color-button-primary-bg: var(--color-gray-0-12);
    --color-button-disabled: var(--color-gray-0-51);
    --color-button-disabled-bg: var(--color-gray-0-20);

    --color-form: var(--color-blue-30-38);
    --color-form-focus: var(--color-blue-100-74);
    --color-form-disabled: var(--color-gray-0-51);
    --color-form-disabled-bg: var(--color-gray-0-20);

    --bg-body: var(--color-gray-0-98);
    --grad-primary: var(--grad-2);
    --bg-button-1ary: var(--grad-3);
    --bg-button-1ary-focus: var(--grad-2);
    --bg-button-default: var(--grad-4);
    --bg-button-default-focus: var(--grad-5);
    --bg-button-large: var(--grad-6);
    --bg-button-large-focus: var(--grad-5);
  }
`;
