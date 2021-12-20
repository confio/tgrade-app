import { StyledDatePicker } from "./style";

interface DatePickerProps {
  disabled: boolean;
  onChange: (d: any) => void;
}

export function DatePicker({ disabled, onChange }: DatePickerProps): JSX.Element {
  const dateFormat = "DD/MM/YYYY";
  return <StyledDatePicker onChange={(d) => onChange(d)} disabled={disabled} format={dateFormat} />;
}
