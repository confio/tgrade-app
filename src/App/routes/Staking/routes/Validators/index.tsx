import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { BorderContainer, MainStack, ValidatorItem, ValidatorStack } from "./style";

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
  const { getStakingClient } = useSdk();

  const [validatorsData, setValidatorsData] = useState<readonly ValidatorData[]>([]);

  useEffect(() => {
    (async function updateValidatorsData() {
      const { validators } = await getStakingClient().staking.unverified.validators("BOND_STATUS_BONDED");
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

      setValidatorsData(validatorsData);
    })();
  }, [getStakingClient]);

  function goToValidator(address: string) {
    history.push(`${pathValidatorsMatched}/${address}`);
  }

  return (
    <PageLayout hide="back-button">
      <MainStack>
        <Title>Validators</Title>
        <ValidatorStack>
          {validatorsData.map((validator) => (
            <ValidatorItem key={validator.name} onClick={() => goToValidator(validator.address)}>
              <BorderContainer>
                <Text>{validator.name}</Text>
              </BorderContainer>
            </ValidatorItem>
          ))}
        </ValidatorStack>
      </MainStack>
    </PageLayout>
  );
}
