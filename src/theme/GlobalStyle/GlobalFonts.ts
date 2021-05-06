import * as styled from "styled-components";

export const GlobalFonts = styled.createGlobalStyle`
  :root {
    --ff-montserrat: Montserrat, sans-serif;
    --ff-iceland: Iceland, serif;
    --ff-quicksand: Quicksand, sans-serif;

    --ff-text: var(--ff-quicksand);
    --ff-heading: var(--ff-quicksand);

    font-family: var(--ff-text);
    font-size: var(--s0);
  }

  span.ant-typography,
  div.ant-typography,
  p.ant-typography,
  h1.ant-typography,
  h2.ant-typography,
  h3.ant-typography {
    overflow-wrap: anywhere;
    margin: 0;
    line-height: var(--ratio);
  }

  span.ant-typography,
  div.ant-typography,
  p.ant-typography {
    font-family: var(--ff-text);
    font-size: var(--s0);
    color: var(--color-text-2ary);
  }

  h1.ant-typography,
  h2.ant-typography,
  h3.ant-typography {
    font-family: var(--ff-heading);
    color: var(--color-text-1ary);
  }

  h1.ant-typography {
    font-size: var(--s3);
  }

  h2.ant-typography {
    font-size: var(--s2);
  }

  h3.ant-typography {
    font-size: var(--s1);
  }
`;
