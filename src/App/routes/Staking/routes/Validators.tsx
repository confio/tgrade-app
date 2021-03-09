import { Button, Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";

const { Title, Text } = Typography;

interface ValidatorData {
  readonly name: string;
  readonly address: string;
}

function validatorCompare(a: ValidatorData, b: ValidatorData) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

export default function Validators(): JSX.Element {
  const history = useHistory();
  const { url: pathValidatorsMatched } = useRouteMatch();
  const { getQueryClient } = useSdk();

  const [validatorsData, setValidatorsData] = useState<readonly ValidatorData[]>([]);

  useEffect(() => {
    let mounted = true;

    (async function updateValidatorsData() {
      const { validators } = await getQueryClient().staking.unverified.validators("BOND_STATUS_BONDED");
      if (!validators) {
        throw new Error("No bonded validators found");
      }

      const validatorsData: readonly ValidatorData[] = validators
        .map(
          (validator): ValidatorData => ({
            name: validator.description?.moniker || "",
            address: validator.operatorAddress || "",
          }),
        )
        .filter(({ name, address }) => name && address)
        .sort(validatorCompare);

      if (!validatorsData.length) {
        throw new Error("No bonded validators found");
      }

      if (mounted) setValidatorsData(validatorsData);
    })();

    return () => {
      mounted = false;
    };
  }, [getQueryClient]);

  function goToValidator(address: string) {
    history.push(`${pathValidatorsMatched}/${address}`);
  }

  return (
    <PageLayout hide="back-button">
      <Stack gap="s5">
        <Title>Validators</Title>
        <Stack>
          {validatorsData.map((validator) => (
            <Button
              key={validator.name}
              data-size="large"
              type="primary"
              onClick={() => goToValidator(validator.address)}
            >
              <Text>{validator.name}</Text>
            </Button>
          ))}
        </Stack>
      </Stack>
    </PageLayout>
  );
}
