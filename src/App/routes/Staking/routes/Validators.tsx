import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { NavPagination, pageSize } from "App/components/logic";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { useLayout } from "service/layout";

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
  const { t } = useTranslation("staking");
  const history = useHistory();
  const { url: pathValidatorsMatched } = useRouteMatch();
  useLayout({});

  const { getQueryClient } = useSdk();

  const [validatorsData, setValidatorsData] = useState<readonly ValidatorData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;

    (async function updateValidatorsData() {
      const { validators } = await getQueryClient().staking.unverified.validators("BOND_STATUS_BONDED");
      if (!validators) {
        throw new Error(t("error.noBondedValidators"));
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
        throw new Error(t("error.noBondedValidators"));
      }

      if (mounted) setValidatorsData(validatorsData);
    })();

    return () => {
      mounted = false;
    };
  }, [getQueryClient, t]);

  function goToValidator(address: string) {
    history.push(`${pathValidatorsMatched}/${address}`);
  }

  return (
    <Stack gap="s5">
      <Title>{t("validators")}</Title>
      <NavPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        total={validatorsData.length}
      />
      <Stack>
        {validatorsData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((validator) => (
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
  );
}
