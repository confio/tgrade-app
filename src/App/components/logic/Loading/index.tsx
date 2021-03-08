import { LoadingOutlined } from "@ant-design/icons";
import * as React from "react";
import { HTMLAttributes, useEffect, useState } from "react";
import { StyledSpin } from "./style";

interface LoadingProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly loading?: string;
}

export default function Loading({ loading, children }: LoadingProps): JSX.Element {
  const [showSpinner, setShowSpinner] = useState(false);

  // Only show spinner if loading takes longer than 200ms
  useEffect(() => {
    setShowSpinner(false);

    const timer = setTimeout(() => {
      if (loading !== undefined) setShowSpinner(true);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [loading]);

  return <>{showSpinner ? <StyledSpin indicator={<LoadingOutlined spin />} tip={loading} /> : children}</>;
}
