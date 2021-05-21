import { Button, Typography } from "antd";
import { OldPageLayout, Stack } from "App/components/layout";
import { Loading, NavPagination, pageSize } from "App/components/logic";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, useError, useLayout, useSdk } from "service";

const { Title, Text } = Typography;

interface ListedValidator {
  readonly name: string;
  readonly address: string;
}

function validatorCompare(a: ListedValidator, b: ListedValidator) {
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

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch), [layoutDispatch]);

  const { handleError } = useError();
  const {
    sdkState: { queryClient },
  } = useSdk();

  const { hasNextPage, fetchNextPage, data: validatorsData } = useInfiniteQuery(
    "validators",
    ({ pageParam = undefined }) => queryClient.staking.validators("BOND_STATUS_BONDED", pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage.pagination?.nextKey.length ? lastPage.pagination.nextKey : undefined,
      onError: (queryError) => handleError(new Error(queryError as any)),
    },
  );

  useEffect(() => {
    if (hasNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage]);

  const validators: readonly ListedValidator[] = validatorsData?.pages
    ? validatorsData.pages
        .flatMap(({ validators }) =>
          validators.map(
            (validator): ListedValidator => ({
              name: validator.description?.moniker || "",
              address: validator.operatorAddress,
            }),
          ),
        )
        .filter(({ name, address }) => name && address)
        .sort(validatorCompare)
    : [];

  const [currentPage, setCurrentPage] = useState(1);

  function goToValidator(address: string) {
    history.push(`${pathValidatorsMatched}/${address}`);
  }

  return (
    <OldPageLayout>
      <Stack gap="s5">
        <Title>{t("validators")}</Title>
        <NavPagination currentPage={currentPage} setCurrentPage={setCurrentPage} total={validators.length} />
        {validators.length ? (
          <Loading loading={hasNextPage ? t("loadingValidators") : undefined}>
            <Stack>
              {validators.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((validator) => (
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
          </Loading>
        ) : (
          <Text>{t("validatorsNotFound")}</Text>
        )}
      </Stack>
    </OldPageLayout>
  );
}
