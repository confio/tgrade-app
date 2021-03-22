import { Button, Typography } from "antd";
import * as React from "react";
import { HTMLAttributes } from "react";
import starEmptyIcon from "./assets/star-empty.svg";
import starFilledIcon from "./assets/star-filled.svg";
import { ButtonWrapper, FavAndDenom, TokenAndAmount } from "./style";

const { Text } = Typography;

interface TokenButtonProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly denom: string;
  readonly amount: string;
  readonly isFav: boolean;
  readonly onFav: () => void;
}

export default function TokenButton({
  isFav,
  onFav,
  denom,
  amount,
  ...restProps
}: TokenButtonProps): JSX.Element {
  return (
    <ButtonWrapper tabIndex={0} data-size="large" className="ant-btn ant-btn-primary" {...restProps}>
      <TokenAndAmount>
        <FavAndDenom>
          <Button
            onClick={(event) => {
              onFav();
              event.stopPropagation();
            }}
          >
            <img src={isFav ? starFilledIcon : starEmptyIcon} alt={`Star ${isFav ? "unfav" : "fav"}`} />
          </Button>
          <Text>{denom}</Text>
        </FavAndDenom>
        <Text>{amount}</Text>
      </TokenAndAmount>
    </ButtonWrapper>
  );
}
