import moment from "moment";

import { StyledDatePicker } from "./style";

interface DatePickerProps {
  disabled: boolean;
}

export function DatePicker({ disabled }: DatePickerProps): JSX.Element {
  const dateFormat = "DD/MM/YYYY";
  return (
    <StyledDatePicker
      disabled={disabled}
      defaultValue={moment("01/01/2022", dateFormat)}
      format={dateFormat}
    />
  );
}
