import dayjs from "dayjs";

export const mergeArraysBySettingName = ({
  arr1 = [],
  arr2 = [],
}: {
  arr1:
    | { settingName: string; data: { timestamp: number; count: number }[] }[]
    | undefined;
  arr2:
    | { settingName: string; data: { timestamp: number; count: number }[] }[]
    | undefined;
}) => {
  if (!arr1) return [];
  if (!arr2) return arr1;

  // 배열을 settingName을 키로 하는 객체로 변환
  const map1 = new Map<string, { timestamp: number; count: number }[]>();
  arr1.forEach(item => {
    map1.set(item.settingName, item.data);
  });

  // arr2를 필터링하여 arr1에 존재하는 settingName만 포함
  const filteredArr2 = arr2.filter(item => map1.has(item.settingName));

  // arr2의 필터링된 데이터와 arr1의 데이터를 병합
  filteredArr2.forEach(item => {
    if (map1.has(item.settingName)) {
      // 기존 데이터에 병합
      const existingData = map1.get(item.settingName);
      map1.set(item.settingName, [...existingData, ...item.data]);
    }
  });

  // 맵을 배열로 변환
  return Array.from(map1.entries()).map(([settingName, data]) => ({
    settingName,
    data,
  }));
};

export const transformData = (
  data
): { settingName: string; data: { x: string; y: number }[] }[] => {
  return data.map(setting => ({
    settingName: setting.settingName,
    data: setting.data.map(item => ({
      x: dayjs(item.timestamp).format("HH:mm:ss"), // 날짜 문자열 형식으로 변환
      y: item.count,
    })),
  }));
};

export const getPeakTimes = data => {
  // 결과를 저장할 배열
  const peakTimes = [];

  // 데이터 배열을 순회
  data.forEach(setting => {
    const { settingName, data: times } = setting;

    // 가장 높은 count를 찾기 위한 변수
    let maxCount = -1;
    let peakTime = undefined;

    // 각 데이터 포인트를 비교
    times.forEach(item => {
      if (item.count > maxCount) {
        maxCount = item.count;
        peakTime = item;
      }
    });

    // peakTime이 존재하면 결과 배열에 추가
    if (peakTime) {
      peakTimes.push({ settingName, peak: peakTime });
    }
  });

  return peakTimes;
};
