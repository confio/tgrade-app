import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { Loading, NavPagination, pageSize, Search } from "App/components/logic";
import { paths } from "App/paths";
import { Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useContracts, useSdk } from "service";
import { setInitialLayoutState, useLayout } from "service/layout";
import {
  CW20,
  Cw20Token,
  cw20TokenCompare as cw20TokenCompareNames,
  getCw20Token,
  useLocalStorage,
} from "utils/cw20";
import TokenButton from "./components/TokenButton";
import { DoubleForm } from "./style";

const { Title } = Typography;
const { Option } = Select;

function cw20TokenCompareFavs(favTokens: readonly string[], a: Cw20Token, b: Cw20Token): -1 | 0 | 1 {
  if (favTokens.includes(a.address) && !favTokens.includes(b.address)) {
    return -1;
  }
  if (!favTokens.includes(a.address) && favTokens.includes(b.address)) {
    return 1;
  }
  return 0;
}

export default function TokensList(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");

  const history = useHistory();
  const { url: pathTokensMatched } = useRouteMatch();

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch), [layoutDispatch]);

  const { getConfig, getSigningClient, getAddress } = useSdk();
  const { contracts: cw20Contracts, addContract } = useContracts();

  const [cw20Tokens, setCw20Tokens] = useState<Cw20Token[]>([]);
  const [tokenNameFilter, setTokenNameFilter] = useState("");
  const [sortBy, setSortBy] = useState<"alphabetically" | "favourites">("alphabetically");
  const [favTokens, setFavTokens] = useLocalStorage<readonly string[]>(
    "fav-tokens",
    [],
    JSON.stringify,
    JSON.parse,
  );

  const searchedCw20Tokens = cw20Tokens.filter((token) =>
    token.symbol.toLowerCase().startsWith(tokenNameFilter.toLowerCase()),
  );

  searchedCw20Tokens.sort(cw20TokenCompareNames);
  if (sortBy === "favourites") searchedCw20Tokens.sort((a, b) => cw20TokenCompareFavs(favTokens, a, b));

  const [currentPage, setCurrentPage] = useState(1);
  const currentTokens = searchedCw20Tokens.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    (async function updateContracts() {
      const config = getConfig();
      if (!config.codeId) return;

      const client = getSigningClient();
      const contracts = await client.getContracts(config.codeId);

      const cw20Contracts = contracts.map((contract) => CW20(client).use(contract.address));
      cw20Contracts.forEach(addContract);
    })();
  }, [addContract, getConfig, getSigningClient]);

  useEffect(() => {
    let mounted = true;

    const cw20TokenPromises = cw20Contracts.map((contract) => getCw20Token(contract, getAddress()));

    (async function updateCw20Tokens() {
      const cw20Tokens = await Promise.all(cw20TokenPromises);
      const nonNullCw20Tokens = cw20Tokens.filter((token): token is Cw20Token => token !== null);

      if (mounted) setCw20Tokens(nonNullCw20Tokens);
    })();

    return () => {
      mounted = false;
    };
  }, [cw20Contracts, getAddress]);

  function updateFav(tokenAddress: string, isFav: boolean) {
    if (!isFav) {
      setFavTokens((prevFavTokens) => [...prevFavTokens, tokenAddress]);
    } else {
      setFavTokens((prevFavTokens) => prevFavTokens.filter((address) => address !== tokenAddress));
    }
  }

  function goTokenDetail(tokenAddress: string) {
    history.push(`${pathTokensMatched}/${tokenAddress}`);
  }

  return (
    <Stack gap="s4">
      <Title>{t("tokens")}</Title>
      {cw20Tokens.length ? (
        <Formik
          initialValues={{ tokenName: "", sortBy: "alphabetically" }}
          onSubmit={({ tokenName, sortBy }) => {
            setTokenNameFilter(tokenName);
            setSortBy(sortBy === "favourites" ? sortBy : "alphabetically");
          }}
        >
          {(formikProps) => (
            <DoubleForm>
              <FormItem name="tokenName">
                <Search
                  aria-label="search-input"
                  name="tokenName"
                  placeholder={t("search")}
                  enterButton
                  onChange={formikProps.submitForm}
                />
              </FormItem>
              <FormItem name="sortBy">
                <Select name="sortBy" defaultValue="alphabetically" onChange={formikProps.submitForm}>
                  <Option value="alphabetically">{t("sortAlphabetically")}</Option>
                  <Option value="favourites">{t("sortFavourites")}</Option>
                </Select>
              </FormItem>
            </DoubleForm>
          )}
        </Formik>
      ) : null}
      <NavPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        total={searchedCw20Tokens.length}
      />
      <Loading loading={!cw20Tokens.length ? "" : undefined}>
        <Stack>
          {currentTokens.map((token) => {
            const amountToDisplay = Decimal.fromAtomics(token.amount, token.decimals).toString();
            const isFav = favTokens.includes(token.address);

            return (
              <TokenButton
                key={token.address}
                denom={token.symbol}
                amount={amountToDisplay}
                isFav={isFav}
                onFav={() => updateFav(token.address, isFav)}
                onClick={() => goTokenDetail(token.address)}
              />
            );
          })}
        </Stack>
      </Loading>
      <Link to={`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAdd}`}>
        <Button type="primary">{t("addAnother")}</Button>
      </Link>
    </Stack>
  );
}
