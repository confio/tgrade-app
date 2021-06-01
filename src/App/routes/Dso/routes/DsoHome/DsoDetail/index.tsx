import * as React from "react";
import { useEffect, useState } from "react";
import { useSdk } from "service";

interface DsoDetailParams {
  readonly dsoAddress: string;
}

export default function DsoDetail({ dsoAddress }: DsoDetailParams): JSX.Element {
  const {
    sdkState: { signingClient },
  } = useSdk();
  const [dsoQuery, setDsoQuery] = useState<any>();

  useEffect(() => {
    (async function queryDso() {
      const res = await signingClient.queryContractSmart(dsoAddress, { dso: {} });
      setDsoQuery(JSON.stringify(res, null, 2));
    })();
  }, [dsoAddress, signingClient]);

  return <pre>{dsoQuery}</pre>;
}
