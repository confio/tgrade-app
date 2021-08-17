import { ExitIcon } from "App/components/TMarketPageLayout/style";
import { paths } from "App/paths";
import { Link } from "react-router-dom";
import exitIcon from "./assets/cross.svg";
const Exit = (): JSX.Element => {
  return (
    <Link to={paths.dso.prefix}>
      <ExitIcon src={exitIcon} alt="Exit TMarket" />
    </Link>
  );
};
export default Exit;
