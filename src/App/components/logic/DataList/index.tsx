import { Typography } from "antd";
import { Stack } from "App/components/layout";
import * as React from "react";
import { Fragment } from "react";
import { DataDivider, DataRow } from "./style";

const { Text } = Typography;

export interface DataListProps {
  readonly [key: string]: string;
}

export default function DataList(dataMap: DataListProps): JSX.Element {
  return (
    <Stack>
      {Object.entries(dataMap).map(([key, value], index) => (
        <Fragment key={key}>
          {index > 0 ? <DataDivider /> : null}
          <DataRow>
            <Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <Text>{value}</Text>
          </DataRow>
        </Fragment>
      ))}
    </Stack>
  );
}
