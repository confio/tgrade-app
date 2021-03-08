import { YourAccount } from "App/components/logic";
import * as React from "react";
import { useLayout } from "service/layout";

export default function Account(): JSX.Element {
  useLayout();
  return <YourAccount />;
}
