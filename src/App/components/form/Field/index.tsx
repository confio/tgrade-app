import { Typography } from "antd";
import { Input } from "formik-antd";
import * as React from "react";
import { getFormItemName } from "utils/forms";
import { StyledFormItem, UnitlessInput } from "./style";

const { Text } = Typography;

interface FieldProps {
  readonly label: string;
  readonly placeholder: string;
  readonly value?: string;
  readonly units?: string;
  readonly disabled?: boolean;
  readonly onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function Field({
  label,
  placeholder,
  value,
  units,
  disabled,
  onInputChange,
}: FieldProps): JSX.Element {
  const formItemName = getFormItemName(label);
  const labelKebabCase = label.toLowerCase().replace(/ /g, "-");
  const labelId = `label-id-${labelKebabCase}`;

  return (
    <StyledFormItem name={formItemName}>
      <Text id={labelId}>{label}</Text>
      {units ? (
        <div className="unit-input-container">
          <div className="unit-wrapper">
            <Text>{units}</Text>
          </div>
          <Input
            aria-labelledby={labelId}
            name={formItemName}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={onInputChange}
          />
        </div>
      ) : (
        <UnitlessInput
          aria-labelledby={labelId}
          name={formItemName}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onInputChange}
        />
      )}
    </StyledFormItem>
  );
}
