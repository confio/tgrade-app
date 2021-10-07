import { Decimal, Uint64 } from "@cosmjs/math";
import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { useTMarket } from "service/tmarket";
import { gtagTokenAction } from "utils/analytics";
import { Contract20WS, EmbeddedLogoType, LogoType, MinterInterface } from "utils/cw20";
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
    sdkState: { config, address, signingClient },
  } = useSdk();
  const {
    tMarketState: { refreshTokens },
  } = useTMarket();

  const [issueTokenStep, setIssueTokenStep] = useState(IssueTokenSteps.Specs);

  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string>();
  const [logoFile, setLogoFile] = useState<EmbeddedLogoType>();
  const [initialSupply, setInitialSupply] = useState("");
  const [decimals, setDecimals] = useState("");
  const [mint, setMint] = useState("");
  const [mintCap, setMintCap] = useState<string>();

  async function submitTokenSpecs(values: FormTokenSpecsFields) {
    setTokenSymbol(values.tokenSymbol);
    setTokenName(values.tokenName);
    setInitialSupply(values.initialSupply);
    setDecimals(values.decimals);
    setMint(values.mint);
    setMintCap(values.mintCap);

    setIssueTokenStep(IssueTokenSteps.Marketing);
  }

  async function submitTokenMarketing(values: FormMarketingFields) {
    gtagTokenAction("create_token_try");
    if (
      !signingClient ||
      !address ||
      !config.codeIds?.cw20Tokens?.length ||
      !config.codeIds?.tgradeCw20?.length
    )
      return;

    try {
      const decimalsNumber = parseInt(decimals, 10);
      const amount = Decimal.fromUserInput(initialSupply, decimalsNumber)
        .multiply(Uint64.fromNumber(10 ** decimalsNumber))
        .toString();
      const cap = mintCap
        ? Decimal.fromUserInput(mintCap, decimalsNumber)
            .multiply(Uint64.fromNumber(10 ** decimalsNumber))
            .toString()
        : undefined;
      const canMint = mint === "fixed" || mint === "unlimited";
      const minter: MinterInterface | undefined = canMint ? { minter: address, cap } : undefined;

      const codeId = values.dsoAddress ? config.codeIds.tgradeCw20[0] : config.codeIds.cw20Tokens[0];
      const logo: LogoType | undefined = logoUrl
        ? { url: logoUrl }
        : logoFile
        ? { embedded: logoFile }
        : undefined;
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
        [{ address, amount }],
        minter,
        config.gasPrice,
        marketing,
        values.dsoAddress,
      );

      setTxResult({
        contractAddress,
        msg: `You created token ${tokenName} (${contractAddress}).`,
      });
      gtagTokenAction("create_token_success");
      await refreshTokens();
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }
  }

  return (
    <>
      {issueTokenStep === IssueTokenSteps.Specs ? (
        <TokenSpecs
          closeModal={closeModal}
          setLogoUrl={setLogoUrl}
          setLogoFile={setLogoFile}
          handleSubmit={submitTokenSpecs}
        />
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
