import { Typography } from "antd";
import Button from "App/components/form/Button";
import { PageLayout } from "App/components/layout";
import { RedirectLocation, VideoPlayer } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
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
import { loadKeplrWallet, loadOrCreateWallet, WalletLoader } from "utils/sdk";
import { TextStack, TutorialStack } from "./style";

const { Title, Paragraph } = Typography;

export default function Tutorial(): JSX.Element {
  const history = useHistory();
  const state = history.location.state as RedirectLocation;

  const { layoutDispatch } = useLayout();
  useEffect(
    () =>
      setInitialLayoutState(layoutDispatch, {
        backButtonProps: { path: paths.setup.prefix, text: "Go back" },
        viewTitles: { viewTitle: "Watch Tutorial", viewSubtitle: "Step 00/03" },
        menuState: "hidden",
        showCorporateBanner: true,
      }),
    [layoutDispatch],
  );

  const { handleError } = useError();
  const { sdkState, sdkDispatch } = useSdkInit();
  const [loading, setLoading] = useState(false);

  async function init(loadWallet: WalletLoader) {
    setLoading(true);

    try {
      const signer = await loadWallet(sdkState.config);
      initSdk(sdkDispatch, signer);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  }

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
      <TutorialStack gap="s1">
        <TextStack gap="s-1">
          <Title>How does Tgrade security work?</Title>
          <Paragraph>
            If you've lost your password, Tgrade can't recover your password through email. Instead, you have
            to use your Recovery Phrase.
          </Paragraph>
        </TextStack>
        <VideoPlayer url="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" />
        <Button loading={loading} onClick={() => init(loadOrCreateWallet)}>
          <div>Generate recovery phrase</div>
        </Button>
        <Button loading={loading} onClick={() => init(loadKeplrWallet)}>
          <div>Keplr</div>
        </Button>
      </TutorialStack>
    </PageLayout>
  );
}
