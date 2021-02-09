import { Divider } from "antd";
import * as React from "react";
import { Fragment } from "react";
import { DataRow, KeyText, ListStack, ValueText } from "./style";

export interface DataListProps {
  readonly [key: string]: string;
}

export default function DataList(dataMap: DataListProps): JSX.Element {
  return (
    <ListStack>
      {Object.entries(dataMap).map(([key, value], index) => (
        <Fragment key={key}>
          {index > 0 && <Divider />}
          <DataRow>
            <KeyText>{key.charAt(0).toUpperCase() + key.slice(1)}</KeyText>
            <ValueText>{value}</ValueText>
          </DataRow>
        </Fragment>
      ))}
    </ListStack>
  );
}
