import { LoadingOutlined } from "@ant-design/icons";
import * as React from "react";
import { HTMLAttributes } from "react";
import { loadingDelay } from "utils/ui";
import { StyledSpin } from "./style";

interface LoadingProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly loading?: string;
}

export default function Loading({ loading, children }: LoadingProps): JSX.Element {
  return (
    <>
      {loading !== undefined ? (
        <StyledSpin indicator={<LoadingOutlined spin />} tip={loading} delay={loadingDelay} />
      ) : (
        children
      )}
    </>
  );
}
