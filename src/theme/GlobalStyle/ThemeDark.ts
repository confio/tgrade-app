import * as styled from "styled-components";

export const ThemeDark = styled.createGlobalStyle`
  :root {
    --color-primary: var(--color-blue-100-74);
    --color-text: var(--color-blue-100-74);

    --color-result-success: var(--color-green-63-42);
    --color-result-failure: var(--color-red-79-63);

    --color-error-alert: var(--color-red-79-63);
    --color-error-form: var(--color-red-79-63);

    --color-hover: var(--color-yellow-91-73);

    --color-button-primary-bg: var(--color-gray-0-12);
    --color-button-disabled: var(--color-gray-0-51);
    --color-button-disabled-bg: var(--color-gray-0-20);

    --color-form: var(--color-blue-30-38);
    --color-form-focus: var(--color-blue-100-74);
    --color-form-disabled: var(--color-gray-0-51);
    --color-form-disabled-bg: var(--color-gray-0-20);

    --grad-body: var(--grad-1);
    --grad-primary: var(--grad-2);
    --grad-button-primary: var(--grad-3);
    --grad-button-primary-focus: var(--grad-2);
    --grad-button-default: var(--grad-4);
    --grad-button-default-focus: var(--grad-5);
    --grad-button-large: var(--grad-6);
    --grad-button-large-focus: var(--grad-5);
  }
`;
