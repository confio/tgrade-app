import * as styled from "styled-components";

export const GlobalColors = styled.createGlobalStyle`
  :root {
    --color-gray-0-12: hsl(0, 0%, 12%);
    --color-gray-0-20: hsl(0, 0%, 20%);
    --color-gray-0-51: hsl(0, 0%, 51%);
    --color-red-79-63: hsl(0, 79%, 63%);
    --color-green-63-42: hsl(145, 63%, 42%);
    --color-blue-30-38: hsl(222, 30%, 38%);
    --color-blue-100-74: hsl(229, 100%, 74%);
    --color-yellow-91-73: hsl(29, 91%, 73%);

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

    --grad-body: radial-gradient(circle at 50% 50%, hsl(0, 0%, 12%), hsl(237, 26%, 16%), hsl(239, 40%, 20%)),
      linear-gradient(to bottom, hsl(238, 39%, 15%), hsl(238, 39%, 15%));
    --grad-primary: linear-gradient(
      90deg,
      hsl(245, 89%, 68%) 0%,
      hsl(252, 86%, 67%) 12%,
      hsl(270, 70%, 68%) 33%,
      hsl(248, 90%, 61%) 49%,
      hsl(210, 100%, 63%) 91%
    );
    --grad-button-primary: linear-gradient(
      to bottom,
      hsl(47, 93%, 84%),
      hsl(1, 100%, 77%),
      hsl(317, 95%, 76%),
      hsl(253, 100%, 66%),
      hsl(208, 100%, 72%)
    );
    --grad-button-primary-focus: var(--grad-primary);
    --grad-button-default: linear-gradient(90deg, hsl(249, 31%, 35%) 0%, hsl(240, 20%, 23%) 75%);
    --grad-button-default-focus: linear-gradient(
      90deg,
      hsl(245, 24%, 62%) 0%,
      hsl(251, 22%, 59%) 12%,
      hsl(269, 17%, 38%) 33%,
      hsl(247, 47%, 44%) 49%,
      hsl(210, 68%, 34%) 91%
    );
    --grad-button-large: linear-gradient(180deg, hsl(240, 26%, 19%) 0%, hsl(243, 42%, 32%) 100%);
    --grad-button-large-focus: var(--grad-button-default-focus);
  }
`;
