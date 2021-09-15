import { Typography } from "antd";
import Tooltip from "App/components/Tooltip";
import { Input } from "formik-antd";
import { getFormItemName } from "utils/forms";
import StyledField, { LabelWrapper, UnitlessInput } from "./style";

const { Text } = Typography;

interface FieldProps {
  readonly label: string;
  readonly placeholder: string;
  readonly optional?: boolean;
  readonly tooltip?: string;
  readonly value?: string;
  readonly units?: string;
  readonly disabled?: boolean;
  readonly onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Field({
  label,
  placeholder,
  optional,
  tooltip,
  value,
  units,
  disabled,
  onInputChange,
}: FieldProps): JSX.Element {
  const formItemName = getFormItemName(label);
  const labelKebabCase = label.toLowerCase().replace(/ /g, "-");
  const labelId = `label-id-${labelKebabCase}`;

  return (
    <StyledField name={formItemName}>
      <LabelWrapper>
        <Text id={labelId}>{label}</Text>
        {optional ? <Text>(optional)</Text> : null}
        {tooltip ? <Tooltip title={tooltip} /> : null}
      </LabelWrapper>
      {units ? (
        <div className="unit-input-container">
          <div className="unit-wrapper">
            <Text>{units}</Text>
          </div>
          {value !== undefined && onInputChange !== undefined ? (
            <Input
              aria-labelledby={labelId}
              name={formItemName}
              placeholder={placeholder}
              value={value}
              disabled={disabled}
              onChange={onInputChange}
            />
          ) : (
            <Input
              aria-labelledby={labelId}
              name={formItemName}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
        </div>
      ) : value !== undefined && onInputChange !== undefined ? (
        <UnitlessInput
          aria-labelledby={labelId}
          name={formItemName}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onInputChange}
        />
      ) : (
        <UnitlessInput
          aria-labelledby={labelId}
          name={formItemName}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </StyledField>
  );
}
