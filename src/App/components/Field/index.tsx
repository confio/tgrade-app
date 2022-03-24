import { Typography } from "antd";
import Tooltip from "App/components/Tooltip";
import { Input } from "formik-antd";
import { useMemo } from "react";
import { getFormItemName } from "utils/forms";

import StyledField, { LabelWrapper, UnitInputContainer, UnitWrapper } from "./style";

const { Text } = Typography;

interface InputOrTextAreaProps {
  // TODO: deal with type crazyness
  readonly props: any;
  readonly onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  readonly textArea?: boolean;
  readonly onTextAreaChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

function InputOrTextArea({
  props,
  onInputChange,
  textArea,
  onTextAreaChange,
}: InputOrTextAreaProps): JSX.Element {
  return textArea ? (
    <Input.TextArea
      {...props}
      onChange={onTextAreaChange}
      showCount
      maxLength={500}
      autoSize={{ minRows: 2 }}
    />
  ) : (
    <Input {...props} onChange={onInputChange} />
  );
}

interface FieldProps {
  readonly label: string;
  readonly placeholder: string;
  readonly optional?: boolean;
  readonly textArea?: boolean;
  readonly units?: string;
  readonly tooltip?: string;
  readonly disabled?: boolean;
  readonly value?: string;
  readonly onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  readonly onTextAreaChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export default function Field({
  label,
  placeholder,
  optional,
  textArea,
  units,
  tooltip,
  disabled,
  value,
  onInputChange,
  onTextAreaChange,
}: FieldProps): JSX.Element {
  const formItemName = getFormItemName(label);
  const labelKebabCase = label.toLowerCase().replace(/ /g, "-");
  const labelId = `label-id-${labelKebabCase}`;

  const baseProps = useMemo(
    () => ({
      className: !units ? "unitless-input" : undefined,
      "aria-labelledby": labelId,
      name: formItemName,
      placeholder,
      disabled,
    }),
    [disabled, formItemName, labelId, placeholder, units],
  );

  // NOTE: using value=undefined instead of ommitting makes Formik's initialValues not work
  const controlledProps = useMemo(() => (value ? { ...baseProps, value } : baseProps), [baseProps, value]);

  return (
    <StyledField name={formItemName}>
      <LabelWrapper>
        <Text id={labelId}>{label}</Text>
        {optional ? <Text>(optional)</Text> : null}
        {tooltip ? <Tooltip title={tooltip} /> : null}
      </LabelWrapper>
      <UnitInputContainer>
        {units ? (
          <UnitWrapper>
            <Text>{units}</Text>
          </UnitWrapper>
        ) : null}
        <InputOrTextArea
          props={controlledProps}
          onInputChange={onInputChange}
          textArea={textArea}
          onTextAreaChange={onTextAreaChange}
        />
      </UnitInputContainer>
    </StyledField>
  );
}
