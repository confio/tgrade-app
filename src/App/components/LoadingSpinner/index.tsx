import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { ComponentProps } from "react";

import PageLayout from "../PageLayout";

const loadingIcon = <LoadingOutlined style={{ color: "var(--color-primary)", fontSize: 50 }} spin />;

type LoadingSpinnerProps = {
  readonly spinProps?: ComponentProps<typeof Spin>;
} & (
  | {
      readonly fullPage: true;
      readonly pageLayoutProps?: ComponentProps<typeof PageLayout>;
    }
  | {
      readonly fullPage?: false | undefined;
      readonly pageLayoutProps?: undefined;
    }
);

export default function LoadingSpinner({
  spinProps,
  fullPage,
  pageLayoutProps,
}: LoadingSpinnerProps): JSX.Element {
  return fullPage ? (
    <PageLayout {...pageLayoutProps}>
      <Spin indicator={loadingIcon} {...spinProps} data-cy="loader-spinner-icon" />
    </PageLayout>
  ) : (
    <Spin indicator={loadingIcon} {...spinProps} />
  );
}
