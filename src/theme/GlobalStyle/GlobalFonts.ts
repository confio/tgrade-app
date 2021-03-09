import * as styled from "styled-components";

export const GlobalFonts = styled.createGlobalStyle`
  :root {
    --ff-montserrat: Montserrat, sans-serif;
    --ff-iceland: Iceland, serif;

    --ff-text: var(--ff-montserrat);
    --ff-heading: var(--ff-iceland);

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
    line-height: var(--ratio);
  }

  span.ant-typography,
  div.ant-typography,
  p.ant-typography {
    font-family: var(--ff-text);
    font-size: var(--s0);
    color: var(--color-text);
  }

  h1.ant-typography,
  h2.ant-typography,
  h3.ant-typography {
    font-family: var(--ff-heading);
    color: transparent;
    background: var(--grad-primary);
    background-clip: text;
    -webkit-background-clip: text;
  }

  h1.ant-typography {
    font-size: var(--s5);
  }

  h2.ant-typography {
    font-size: var(--s4);
  }

  h3.ant-typography {
    font-size: var(--s3);
  }
`;
