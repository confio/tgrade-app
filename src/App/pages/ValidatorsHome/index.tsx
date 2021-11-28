import { lazy } from "react";

import { Wrapper } from "./style";
const ValidatorOverview = lazy(() => import("App/components/ValidatorOverview"));

export default function ValidatorsHome(): JSX.Element | null {
  return (
    <Wrapper>
      <ValidatorOverview />
    </Wrapper>
  );
}
