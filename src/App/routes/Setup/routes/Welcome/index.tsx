import { Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { setInitialLayoutState, useLayout } from "service";
import newUserIcon from "./assets/newUser.svg";
import tgradeLogoIcon from "./assets/tgradeLogo.svg";
import { TextStack } from "./style";
import WelcomeLink from "./WelcomeLink";

const { Title, Paragraph } = Typography;

export default function Welcome(): JSX.Element {
  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { menuState: "hidden", showCorporateBanner: true }), [
    layoutDispatch,
  ]);

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
