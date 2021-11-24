import PageLayout from "App/components/PageLayout";
import { lazy } from "react";

const OcDetail = lazy(() => import("App/components/OcDetail"));

export default function ValidatorsHome(): JSX.Element | null {
  return (
    <PageLayout maxwidth="75rem" centered="false">
      <p>Hello</p>
      <OcDetail />
    </PageLayout>
  );
}
