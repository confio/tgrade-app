import { LoadingOutlined } from "@ant-design/icons";
import { PageLayout } from "App/components/layout";
import * as React from "react";
import { StyledSpin } from "./style";

const spinIndicator = <LoadingOutlined spin />;

interface LoadingProps {
  readonly loadingText?: string;
}

export default function Loading({ loadingText }: LoadingProps): JSX.Element {
  const tip = loadingText || "Loading...";

  return (
    <PageLayout hide="header">
      <StyledSpin indicator={spinIndicator} tip={tip} />
    </PageLayout>
  );
}
