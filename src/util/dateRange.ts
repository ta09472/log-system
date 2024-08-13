import { DatePickerProps } from "antd";
import relativeTime from "dayjs/plugin/relativeTime";
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

export function getDateFormat(date1, date2) {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);

  const diffInDays = d2.diff(d1, "day"); // 날짜 차이 계산

  if (diffInDays <= 1) {
    // 1일 미만일 때
    return "MMM D, h:mm A";
  } else if (diffInDays >= 1 && diffInDays < 7) {
    // 1일 이상 7일 미만일 때
    return "MMM D"; // MM, DD 형식
  } else {
    // 7일 이상일 때
    return "YYYY-MM-DD"; // YYYY:MM:DD 형식
  }
}
