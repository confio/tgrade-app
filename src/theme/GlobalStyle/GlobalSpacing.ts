import * as styled from "styled-components";

const spacings = ["s-4", "s-3", "s-2", "s-1", "s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const;
export type Spacing = typeof spacings[number];

export const GlobalSpacing = styled.createGlobalStyle`
  :root {
    --ratio: 1.25;
    --border-width: 1px;
    --border-radius: 6px;

    /* Generate CSS custom properties with the "spacings" array, like so:
      --s-2: calc(var(--s-1) / var(--ratio));
      --s-1: calc(var(--s0) / var(--ratio));
      --s0: 1rem;
      --s1: calc(var(--s0) * var(--ratio));
      --s2: calc(var(--s1) * var(--ratio));
    */
    ${() =>
      spacings.map((spacing: Spacing) => {
        if (spacing === "s0") return "--s0: 1rem;";

        // For spacing = "s3" => spacingPrevNum = 2 and spacingRoot = "--s"
        // For spacing = "s-2" => spacingPrevNum = 1 and spacingRoot = "--s-"
        // For spacing = "s-1" => spacingPrevNum = 0 and spacingRoot = "--s"
        const spacingPrevNum = parseInt(spacing.slice(-1), 10) - 1;
        const spacingRoot = `--${spacing.slice(0, -1)}`;
        const spacingPrevRoot = spacingPrevNum === 0 ? "--s" : spacingRoot;
        const ratioOp = spacingRoot === "--s" ? "*" : "/";

        return `--${spacing}: calc(var(${spacingPrevRoot}${spacingPrevNum}) ${ratioOp} var(--ratio));`;
      })}
  }
`;
