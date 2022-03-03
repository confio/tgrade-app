import { Typography } from "antd";
import Tooltip from "App/components/Tooltip";
import { Input } from "formik-antd";
import { useCallback, useMemo } from "react";
import { getFormItemName } from "utils/forms";

import StyledField, { LabelWrapper, UnitInputContainer, UnitWrapper } from "./style";

const { Text } = Typography;

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

  const InputOrTextArea = useCallback(
    () =>
      textArea ? (
        <Input.TextArea
          {...controlledProps}
          onChange={onTextAreaChange}
          showCount
          maxLength={500}
          autoSize={{ minRows: 2 }}
        />
      ) : (
        <Input {...controlledProps} onChange={onInputChange} />
      ),
    [controlledProps, onInputChange, onTextAreaChange, textArea],
  );

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
        <InputOrTextArea />
      </UnitInputContainer>
    </StyledField>
  );
}
