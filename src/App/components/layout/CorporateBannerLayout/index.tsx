import { Typography } from "antd";
import { Stack } from "App/components/layout";
import * as React from "react";
import { HTMLAttributes } from "react";
import blockchainArt from "./assets/blockchainArt.jpg";
import cornerBottomRight from "./assets/cornerBottomRight.svg";
import cornerTopLeft from "./assets/cornerTopLeft.svg";
import dotMatrix from "./assets/dotMatrix.svg";
import tgradeLogoTitle from "./assets/tgradeLogoTitle.svg";
import {
  BannerContainer,
  CornerBottomRight,
  CornerBottomWrapper,
  CornerStack,
  CornerTopLeft,
  CorporateBannerStack,
  DotMatrix,
  TgradeLogo,
} from "./style";

const { Title, Paragraph } = Typography;

export default function CorporateBannerLayout({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  return (
    <BannerContainer>
      <CorporateBannerStack tag="aside" gap="s2" backgroundImageUrl={blockchainArt}>
        <TgradeLogo className="tgrade-logo" src={tgradeLogoTitle} alt="Tgrade logo with title" />
        <CornerStack gap="s1">
          <CornerTopLeft src={cornerTopLeft} alt="" />
          <Stack gap="s-1">
            <Title level={2}>Decentralized Finance In A Self-Sovereign Regulated Environment</Title>
            <CornerBottomWrapper>
              <Paragraph>
                Our vision is for self-sovereign groups, bound by their local jurisdiction and regulations,
                trading P2P programmable financial instruments.
              </Paragraph>
              <CornerBottomRight src={cornerBottomRight} alt="" />
            </CornerBottomWrapper>
          </Stack>
        </CornerStack>
        <DotMatrix src={dotMatrix} alt="" />
      </CorporateBannerStack>
      {children}
    </BannerContainer>
  );
}
