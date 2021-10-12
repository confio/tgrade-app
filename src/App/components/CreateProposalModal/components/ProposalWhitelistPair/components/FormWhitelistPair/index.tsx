import { SelectValue } from "antd/lib/select";
import { ReactComponent as DownArrow } from "App/assets/icons/down-arrow.svg";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useSdk } from "service";
import { getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";
import { TokensPerPair } from "../..";
import { ButtonGroup, Separator, StyledSelect } from "./style";

const { Option } = StyledSelect;

const commentLabel = "Comment";

export interface FormWhiteilstPairValues {
  readonly comment: string;
}

interface FormWhitelistPairProps extends FormWhiteilstPairValues {
  readonly tokensPerPairs: readonly TokensPerPair[];
  readonly pairAddress: string;
  readonly setPairAddress: React.Dispatch<React.SetStateAction<string>>;
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormWhiteilstPairValues) => void;
}

export default function FormWhitelistPair({
  tokensPerPairs,
  pairAddress,
  setPairAddress,
  comment,
  goBack,
  handleSubmit,
}: FormWhitelistPairProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();

  const validationSchema = Yup.object().shape({
    [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
  });

  return (
    <Formik
      initialValues={{ [getFormItemName(commentLabel)]: comment }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const comment = values[getFormItemName(commentLabel)];
        handleSubmit({ comment });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <StyledSelect
                suffixIcon={<DownArrow />}
                size="large"
                value={
                  isValidAddress(pairAddress, config.addressPrefix) ? pairAddress : "Select pair to whitelist"
                }
                onChange={(pair: SelectValue) => setPairAddress(pair as string)}
              >
                {tokensPerPairs.map((pair) => (
                  <Option key={pair.pairAddress} value={pair.pairAddress}>
                    {`${pair.tokenA.name} ⇄ ${pair.tokenB.name}`}
                  </Option>
                ))}
              </StyledSelect>
              <Field label={commentLabel} placeholder="Enter comment" optional />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button
                  disabled={!isValid || !isValidAddress(pairAddress, config.addressPrefix)}
                  onClick={() => submitForm()}
                >
                  <div>Create proposal</div>
                </Button>
              </ButtonGroup>
            </Stack>
          </Form>
        </>
      )}
    </Formik>
  );
}
