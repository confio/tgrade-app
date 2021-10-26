import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { ComponentProps } from "react";

import PageLayout from "../PageLayout";

const loadingIcon = <LoadingOutlined style={{ color: "var(--color-primary)", fontSize: 50 }} spin />;

type LoadingSpinnerProps =
  | ({ readonly fullPage: true } & ComponentProps<typeof PageLayout>)
  | { readonly fullPage?: false };

export default function LoadingSpinner({ fullPage, ...restProps }: LoadingSpinnerProps): JSX.Element {
  return fullPage ? (
    <PageLayout {...restProps}>
      <Spin indicator={loadingIcon} />
    </PageLayout>
  ) : (
    <Spin indicator={loadingIcon} />
  );
}
