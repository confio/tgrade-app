import * as styled from "styled-components";

export const GlobalColors = styled.createGlobalStyle`
  :root {
    --color-gray-0-12: hsl(0, 0%, 12%);
    --color-gray-0-20: hsl(0, 0%, 20%);
    --color-gray-0-51: hsl(0, 0%, 51%);
    --color-gray-0-98: hsl(0, 0%, 98%);
    --color-red-79-63: hsl(0, 79%, 63%); /* New tgrade error */
    --color-red-100-70: hsl(0, 100%, 70%);
    --color-yellow-91-73: hsl(29, 91%, 73%);
    --color-yellow-74-56: hsl(45, 74%, 56%); /* New tgrade warning */
    --color-green-63-42: hsl(145, 63%, 42%); /* New tgrade success */
    --color-green-88-37: hsl(180, 88%, 37%);
    --color-blue-12-47: hsl(216, 12%, 47%); /* New tgrade dark gray */
    --color-blue-15-59: hsl(218, 15%, 59%);
    --color-blue-12-90: hsl(220, 12%, 90%);
    --color-blue-97-57: hsl(221, 97%, 57%); /* New tgrade info */
    --color-blue-30-38: hsl(222, 30%, 38%);
    --color-blue-14-16: hsl(225, 14%, 16%);
    --color-blue-19-13: hsl(225, 19%, 13%); /* New tgrade black */
    --color-blue-41-95: hsl(229, 41%, 95%); /* New tgrade light gray */
    --color-blue-100-74: hsl(229, 100%, 74%);

    --grad-1: linear-gradient(333.19deg, #71399f 0%, #71399f 10.73%, #ec096d 79.79%, #ec096d 100%);
    --grad-2: linear-gradient(
      90deg,
      hsl(245, 89%, 68%) 0%,
      hsl(252, 86%, 67%) 12%,
      hsl(270, 70%, 68%) 33%,
      hsl(248, 90%, 61%) 49%,
      hsl(210, 100%, 63%) 91%
    );
    --grad-3: linear-gradient(
      to bottom,
      hsl(47, 93%, 84%),
      hsl(1, 100%, 77%),
      hsl(317, 95%, 76%),
      hsl(253, 100%, 66%),
      hsl(208, 100%, 72%)
    );
    --grad-4: linear-gradient(90deg, hsl(249, 31%, 35%) 0%, hsl(240, 20%, 23%) 75%);
    --grad-5: linear-gradient(
      90deg,
      hsl(245, 24%, 62%) 0%,
      hsl(251, 22%, 59%) 12%,
      hsl(269, 17%, 38%) 33%,
      hsl(247, 47%, 44%) 49%,
      hsl(210, 68%, 34%) 91%
    );
    --grad-6: linear-gradient(180deg, hsl(240, 26%, 19%) 0%, hsl(243, 42%, 32%) 100%);
  }
`;
