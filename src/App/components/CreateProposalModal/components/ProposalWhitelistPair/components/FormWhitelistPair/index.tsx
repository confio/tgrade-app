import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useSdk } from "service";
import { getDecodedAddress, getFormItemName } from "utils/forms";
import * as Yup from "yup";
import { ButtonGroup, Separator } from "./style";

const pairAddressLabel = "Address from the pair to be whitelisted";
const commentLabel = "Comment";

export interface FormWhiteilstPairValues {
  readonly pairAddress: string;
  readonly comment: string;
}

interface FormWhitelistPairProps extends FormWhiteilstPairValues {
  readonly setPairAddress: React.Dispatch<React.SetStateAction<string>>;
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormWhiteilstPairValues) => void;
}

export default function FormWhitelistPair({
  pairAddress,
  setPairAddress,
  comment,
  goBack,
  handleSubmit,
}: FormWhitelistPairProps): JSX.Element {
  const {
    sdkState: {
      config: { addressPrefix },
    },
  } = useSdk();

  const validationSchema = Yup.object().shape({
    [getFormItemName(pairAddressLabel)]: Yup.string()
      .typeError("Pair address address must be alphanumeric")
      .required("Pair address address is required")
      .test(`is-valid-bech32`, "Pair address address is malformed", (address) => {
        const decodedAddress = getDecodedAddress(address);
        return !!decodedAddress;
      })
      .test(`has-valid-prefix`, `Pair address address must start with ${addressPrefix}`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return decodedAddress?.prefix === addressPrefix;
      })
      .test(`has-valid-length`, `Pair address address must have a data length of 20`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return decodedAddress?.data.length === 20;
      }),
    [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
  });

  return (
    <Formik
      initialValues={{
        [getFormItemName(pairAddressLabel)]: pairAddress,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const pairAddress = values[getFormItemName(pairAddressLabel)];
        const comment = values[getFormItemName(commentLabel)];
        handleSubmit({ pairAddress, comment });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={pairAddressLabel} placeholder="Enter address" />
              <Field label={commentLabel} placeholder="Enter comment" />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button disabled={!isValid} onClick={() => submitForm()}>
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
