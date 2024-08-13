import { DatePickerProps } from "antd";
import dayjs from "dayjs";

const disabled7DaysDate: DatePickerProps["disabledDate"] = (
  current,
  { from }
) => {
  const now = dayjs(); // 현재 시간을 기준으로 설정
  if (from) {
    // 7일 이상의 차이 또는 현재 이후 날짜를 비활성화
    return current.isAfter(now) || Math.abs(current.diff(from, "days")) >= 7;
  }

  // 현재 이후 날짜를 비활성화
  return current.isAfter(now);
};
export default disabled7DaysDate;

export function getDateFormat(date1, date2) {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);

  const diffInDays = d2.diff(d1, "day");
  const diffInHours = d2.diff(d1, "hour"); // 시간 차이 계산

  if (diffInHours <= 1) {
    // 1시간 미만일 때
    return "h:mm:ss"; // 시간 형식
  } else if (diffInDays <= 1) {
    // 1일 미만일 때
    return "MMM D, h:mm A"; // 예: Aug 7, 9:00 PM
  } else if (diffInDays > 1 && diffInDays < 7) {
    // 1일 이상 7일 미만일 때
    return "MMM D"; // 예: Aug 7
  } else {
    // 7일 이상일 때
    return "YYYY-MM-DD"; // 예: 2024-08-07
  }
}

export const generateTicks = (startDate, endDate, scale) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diffInMinutes = end.diff(start, "minute");
  const diffInHours = end.diff(start, "hour");
  const diffInDays = end.diff(start, "day");

  let ticks = [];
  if (diffInMinutes <= 1) {
    // 1분 이내일 때
    ticks = Array.from({ length: 60 }, (_, i) =>
      start.add(i * (diffInMinutes / 60), "minute").toDate()
    );
  } else if (diffInHours <= 1) {
    // 1시간 이내일 때
    ticks = Array.from({ length: 60 }, (_, i) =>
      start.add(i * (diffInHours / 60), "minute").toDate()
    );
  } else if (diffInDays <= 1) {
    // 1일 이내일 때
    ticks = Array.from({ length: 24 }, (_, i) => start.add(i, "hour").toDate());
  } else {
    // 1일 이상일 때
    ticks = Array.from({ length: Math.ceil(diffInDays) }, (_, i) =>
      start.add(i, "day").toDate()
    );
  }

  return ticks.map(date => scale(date));
};
