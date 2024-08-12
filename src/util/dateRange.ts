import { DatePickerProps } from "antd";
import dayjs from "dayjs";

const disabled7DaysDate: DatePickerProps["disabledDate"] = (
  current,
  { from }
) => {
  const today = dayjs().startOf("day"); // 오늘 날짜를 기준으로 설정
  if (from) {
    // 7일 이상의 차이 또는 오늘 이후 날짜를 비활성화
    return current.isAfter(today) || Math.abs(current.diff(from, "days")) >= 7;
  }

  // 오늘 이후 날짜를 비활성화
  return current.isAfter(today);
};

export default disabled7DaysDate;
