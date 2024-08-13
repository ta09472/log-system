export const colorPallet = [
  "#ff4b4b",
  "#ffc12f",
  "#ffe437",
  "#a1ff42",
  "#3cff2e",
  "#39ff6a",
  "#3affd4",
  "#185dff",
  "#b547ff",
  "#000000",
];

export const colorAccessor = (id: number) => {
  return colorPallet.at(id) || "#000000"; // 색상이 정의되지 않은 경우 기본 색상으로 검정색을 사용
};
