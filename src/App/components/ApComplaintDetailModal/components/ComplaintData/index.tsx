import { Typography } from "antd";
import AddressTag from "App/components/AddressTag";
import Stack from "App/components/Stack/style";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ApContractQuerier, Complaint } from "utils/arbiterPool";

import { ComplaintField } from "./style";

const { Text } = Typography;

interface ComplaintDataProps {
  readonly complaintId: number | undefined;
}

export default function ComplaintData({ complaintId }: ComplaintDataProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client },
  } = useSdk();

  const [complaint, setComplaint] = useState<Complaint>();

  useEffect(() => {
    (async function () {
      if (!client || complaintId === undefined) return;

      try {
        const apContract = new ApContractQuerier(config, client);
        const complaint = await apContract.getComplaint(complaintId);
        setComplaint(complaint);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, complaintId, config, handleError]);

  const capitalizedState = complaint?.state
    ? Object.keys(complaint.state)[0].charAt(0).toUpperCase() + Object.keys(complaint.state)[0].slice(1) ?? ""
    : "";

  return (
    <Stack>
      <ComplaintField>
        <Text>Title: </Text>
        <Text>{complaint?.title ?? ""}</Text>
      </ComplaintField>
      <ComplaintField>
        <Text>Description: </Text>
        <Text>{complaint?.description ?? ""}</Text>
      </ComplaintField>
      <ComplaintField>
        <Text>Defendant: </Text>
        {complaint?.defendant ? <AddressTag address={complaint.defendant} /> : null}
      </ComplaintField>
      <ComplaintField>
        <Text>Plaintiff: </Text>
        {complaint?.plaintiff ? <AddressTag address={complaint.plaintiff} /> : null}
      </ComplaintField>
      <ComplaintField>
        <Text>State: </Text>
        <Text>{capitalizedState}</Text>
      </ComplaintField>
    </Stack>
  );
}
