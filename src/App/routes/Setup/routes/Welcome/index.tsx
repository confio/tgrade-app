import { Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { RedirectLocation } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  hitFaucetIfNeeded,
  initSdk,
  isSdkInitialized,
  setInitialLayoutState,
  useError,
  useLayout,
  useSdkInit,
} from "service";
import { getWallet, loadOrCreateWallet } from "utils/sdk";
import newUserIcon from "./assets/newUser.svg";
import tgradeLogoIcon from "./assets/tgradeLogo.svg";
import { TextStack } from "./style";
import WelcomeLink from "./WelcomeLink";

const { Title, Paragraph } = Typography;

export default function Welcome(): JSX.Element {
  const history = useHistory();
  const state = history.location.state as RedirectLocation;
  const { handleError } = useError();
  const { sdkState, sdkDispatch } = useSdkInit();
  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { menuState: "hidden", showCorporateBanner: true }), [
    layoutDispatch,
  ]);

  useEffect(() => {
    (async function init() {
      try {
        if (!getWallet()) return;
        const signer = await loadOrCreateWallet(sdkState.config);
        initSdk(sdkDispatch, signer);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [handleError, sdkDispatch, sdkState.config]);

  useEffect(() => {
    (async function loginIfInitialized() {
      if (!isSdkInitialized(sdkState)) return;
      await hitFaucetIfNeeded(sdkState);
      if (state) {
        history.push(state.redirectPathname, state.redirectState);
      } else {
        history.push(paths.wallet.prefix);
      }
    })();
  }, [history, sdkState, state]);

  return (
    <PageLayout>
      <Stack gap="s1">
        <TextStack gap="s-1">
          <Title>Welcome to Tgrade!</Title>
          <Paragraph>To begin this journey, create an account or import an existing one.</Paragraph>
        </TextStack>
        <WelcomeLink
          to={`${paths.setup.prefix}${paths.setup.tutorial}`}
          iconSrc={newUserIcon}
          iconAlt="New user icon"
          title="Help me get set up"
          subtitle="I am new to Tgrade"
        />
        <WelcomeLink
          to="#"
          iconSrc={tgradeLogoIcon}
          iconAlt="Tgrade logo icon"
          title="I already have an account"
          subtitle="Import Tgrade account"
        />
      </Stack>
    </PageLayout>
  );
}
