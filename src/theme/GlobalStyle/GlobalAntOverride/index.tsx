import * as React from "react";
import { Buttons } from "./Buttons";
import { Forms } from "./Forms";

export default function GlobalAntOverride(): JSX.Element {
  return (
    <>
      <Buttons />
      <Forms />
    </>
  );
}
