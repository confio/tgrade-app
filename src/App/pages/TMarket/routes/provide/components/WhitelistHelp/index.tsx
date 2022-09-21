import { Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { useProvide } from "service/provide";
import { Contract20WS } from "utils/cw20";
import { TcContractQuerier } from "utils/trustedCircle";
import { ellipsifyAddress } from "utils/ui";

const { Paragraph } = Typography;

interface WhitelistWarnings {
  tokenTcA?: string | undefined;
  tokenTcB?: string | undefined;
}

export default function WhitelistHelp(): JSX.Element | null {
  const {
    sdkState: { client, address },
  } = useSdk();
  const { provideState } = useProvide();
  const { selectedPair } = provideState;

  const [warnings, setWarnings] = useState<WhitelistWarnings>({});

  useEffect(() => {
    (async function () {
      if (!address || !client) return;

      const tokenAddressA = selectedPair?.asset_infos[0].token;
      const tokenAddressB = selectedPair?.asset_infos[1].token;
      const tcAddressA = await Contract20WS.getTcAddress(client, tokenAddressA);
      const tcAddressB = await Contract20WS.getTcAddress(client, tokenAddressB);
      const isPairWhitelistedInTcA = await Contract20WS.isWhitelisted(
        client,
        tokenAddressA || "",
        selectedPair?.contract_addr || "",
      );
      const isPairWhitelistedInTcB = await Contract20WS.isWhitelisted(
        client,
        tokenAddressB || "",
        selectedPair?.contract_addr || "",
      );

      const warnings: WhitelistWarnings = {};

      if (tcAddressA) {
        const { name: tcNameA } = await new TcContractQuerier(tcAddressA, client).getTc();

        const warningMsg = isPairWhitelistedInTcA
          ? undefined
          : `"${tcNameA}" (${ellipsifyAddress(tcAddressA)})`;

        warnings.tokenTcA = warningMsg;
      }

      if (tcAddressB) {
        const { name: tcNameB } = await new TcContractQuerier(tcAddressB, client).getTc();

        const warningMsg = isPairWhitelistedInTcB
          ? undefined
          : `"${tcNameB}" (${ellipsifyAddress(tcAddressB)})`;

        warnings.tokenTcB = warningMsg;
      }

      setWarnings(warnings);
    })();
  }, [address, client, selectedPair?.asset_infos, selectedPair?.contract_addr]);

  return warnings.tokenTcA || warnings.tokenTcB ? (
    <Row
      style={{ marginTop: "var(--s2)", display: "flex", flexDirection: "column", alignItems: "flex-start" }}
    >
      <Paragraph style={{ marginBottom: "var(--s-2)", textAlign: "left", fontSize: "var(--s-1)" }}>
        A Whitelist Proposal needs to be passed on the following Trusted Circles before being able to trade
        with the pair:
      </Paragraph>
      {warnings.tokenTcA ? <Paragraph>{warnings.tokenTcA}</Paragraph> : null}
      {warnings.tokenTcB ? <Paragraph>{warnings.tokenTcB}</Paragraph> : null}
    </Row>
  ) : null;
}
