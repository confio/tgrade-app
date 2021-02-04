import { HTMLAttributes } from "react";
import { useHistory } from "react-router-dom";
import backArrow from "./assets/backArrow.svg";

interface BackButtonProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly path?: string;
  readonly state?: any;
}

export default function BackButton({ path, state, ...props }: BackButtonProps): JSX.Element {
  const history = useHistory();
  const goBack = path ? () => history.push(path, state) : history.goBack;

  return <img src={backArrow} alt="Back arrow" onClick={goBack} {...props} />;
}
