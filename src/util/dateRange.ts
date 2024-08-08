import { DatePickerProps } from "antd";

const disabled7DaysDate: DatePickerProps["disabledDate"] = (
  current,
  { from }
) => {
  if (from) {
    return Math.abs(current.diff(from, "days")) >= 7;
  }

  return false;
};

export default disabled7DaysDate;
