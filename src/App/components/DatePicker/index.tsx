import moment from "moment";

import { StyledDatePicker } from "./style";

interface DatePickerProps {
  disabled: boolean;
  onChange: (d: any) => void;
}

export function DatePicker({ disabled, onChange }: DatePickerProps): JSX.Element {
  const dateFormat = "DD/MM/YYYY";
  return (
    <StyledDatePicker
      onChange={(d) => onChange(d)}
      disabled={disabled}
      defaultValue={moment("01/01/2022", dateFormat)}
      format={dateFormat}
    />
  );
}
