import { Row } from "antd";
import { Stack } from "App/components/layoutPrimitives";
import styled from "styled-components";

export default styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-self: stretch;
  justify-content: center;
  flex-wrap: wrap-reverse;
`;

export const StyledMarketLayout = styled(Stack)<{ "background-image-url": string }>`
  min-height: 100vh;
  min-width: 100%;
  z-index: 10;
  position: absolute;
  flex-basis: 29rem;
  padding-top: clamp(var(--s0), calc(2vw + var(--s0)), var(--s1));
  padding-bottom: calc(clamp(var(--s0), calc(2vw + var(--s0)), var(--s4)) * 2);
  padding-left: clamp(var(--s0), calc(2vw + var(--s0)), var(--s3));
  padding-right: clamp(var(--s0), calc(2vw + var(--s0)), var(--s3));

  background: linear-gradient(0deg, rgba(4, 119, 120, 0.3), rgba(4, 119, 120, 0.3)),
    url(${(p) => p["background-image-url"]});
  background-size: cover;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;s
`;
export const ExitIcon = styled.img`
  width: 20px;
  position: absolute;
  top: 0px;
  right: -33px;
`;
export const TgradeLogo = styled.img`
  height: 1.875rem;
`;

export const CornerStack = styled(Stack)`
  align-items: flex-start;
`;

export const CornerTopLeft = styled.img`
  height: 2.0625rem;
`;

export const CornerBottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CornerBottomRight = styled.img`
  align-self: flex-end;
  height: 2.0625rem;
`;

export const DotMatrix = styled.img`
  margin-left: clamp(var(--s0), calc(2vw + var(--s0)), var(--s4));
  width: 3.75rem;
  height: 3.5rem;
`;
export const NotificationsContainer = styled(Row)`
  width: 100%;
  justify-content: center;
`;
