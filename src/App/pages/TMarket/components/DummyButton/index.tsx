import ButtonCircle from "App/components/ButtonCircle";

import arrowIcon from "../assets/arrow-down-icon.png";
import plusIcon from "../assets/plus-icon.png";

export const PlusIcon = (): JSX.Element => {
  return (
    <ButtonCircle shape="circle" size="middle">
      <img src={plusIcon} alt="Switch tokens" />
    </ButtonCircle>
  );
};

export const ArrowIcon = (): JSX.Element => {
  return (
    <ButtonCircle shape="circle" size="middle">
      <img src={arrowIcon} alt="Switch tokens" />
    </ButtonCircle>
  );
};
