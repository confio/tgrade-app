import { PageLayout } from "App/components/layout";
import { YourAccount } from "App/components/logic";
import * as React from "react";

export default function Account(): JSX.Element {
  return (
    <PageLayout hide="back-button">
      <YourAccount />
    </PageLayout>
  );
}
