import { LoadingOutlined } from "@ant-design/icons";
import * as React from "react";
import { HTMLAttributes } from "react";
import { StyledSpin } from "./style";

interface LoadingProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly loading?: string;
}

export default function Loading({ loading, children }: LoadingProps): JSX.Element {
  //TODO: show spinner delay functionality removed because issues with lock/unlock/import account

  return (
    <>
      {loading !== undefined ? <StyledSpin indicator={<LoadingOutlined spin />} tip={loading} /> : children}
    </>
  );
}
