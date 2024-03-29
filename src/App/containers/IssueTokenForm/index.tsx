import { Decimal, Uint64 } from "@cosmjs/math";
import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { useTokens } from "service/tokens";
import { gtagTokenAction } from "utils/analytics";
import { Contract20WS, LogoType, MinterInterface } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";

import TokenMarketing, { FormMarketingFields } from "./components/TokenMarketing";
import TokenSpecs, { FormTokenSpecsFields } from "./components/TokenSpecs";

enum IssueTokenSteps {
  Specs = "Specs",
  Marketing = "Marketing",
}

interface IssueTokenFormProps {
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
  readonly closeModal: () => void;
}

export default function IssueTokenForm({ setTxResult, closeModal }: IssueTokenFormProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { codeIds, address, signingClient },
  } = useSdk();
  const {
    tokensState: { pinToken, loadToken },
  } = useTokens();

  const [issueTokenStep, setIssueTokenStep] = useState(IssueTokenSteps.Specs);

  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string>();
  const [initialSupply, setInitialSupply] = useState("");
  const [decimals, setDecimals] = useState("");
  const [mint, setMint] = useState("");
  const [mintCap, setMintCap] = useState<string>();

  async function submitTokenSpecs(values: FormTokenSpecsFields) {
    setTokenSymbol(values.tokenSymbol);
    setTokenName(values.tokenName);
    setLogoUrl(values.logoUrl);
    setInitialSupply(values.initialSupply);
    setDecimals(values.decimals);
    setMint(values.mint);
    setMintCap(values.mintCap);

    setIssueTokenStep(IssueTokenSteps.Marketing);
  }

  async function submitTokenMarketing(values: FormMarketingFields) {
    gtagTokenAction("create_token_try");
    if (!signingClient || !address || !codeIds) return;

    try {
      const decimalsNumber = parseInt(decimals, 10);
      const cap = mintCap
        ? Decimal.fromUserInput(mintCap, decimalsNumber)
            .multiply(Uint64.fromNumber(10 ** decimalsNumber))
            .toString()
        : undefined;
      const canMint = mint === "fixed" || mint === "unlimited";
      const minter: MinterInterface | undefined = canMint ? { minter: address, cap } : undefined;

      const codeId = values.dsoAddress ? codeIds.trustedToken : codeIds.token;
      const logo: LogoType | undefined = logoUrl ? { url: logoUrl } : undefined;
      const marketing =
        values.project || values.description || logo
          ? { project: values.project, description: values.description, marketing: address, logo }
          : undefined;

      const contractAddress = await Contract20WS.createContract(
        signingClient,
        codeId,
        address,
        tokenName,
        tokenSymbol,
        decimalsNumber,
        [{ address, amount: initialSupply }],
        minter,
        marketing,
        values.dsoAddress,
      );

      pinToken?.(contractAddress);
      gtagTokenAction("create_token_success");
      setTxResult({
        contractAddress,
        msg: `You created token ${tokenName} (${contractAddress}).`,
      });
      await loadToken?.(contractAddress);
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }
  }

  return (
    <>
      {issueTokenStep === IssueTokenSteps.Specs ? (
        <TokenSpecs closeModal={closeModal} handleSubmit={submitTokenSpecs} />
      ) : issueTokenStep === IssueTokenSteps.Marketing ? (
        <TokenMarketing
          closeModal={closeModal}
          handleSubmit={submitTokenMarketing}
          goBack={() => setIssueTokenStep(IssueTokenSteps.Specs)}
        />
      ) : null}
    </>
  );
}
