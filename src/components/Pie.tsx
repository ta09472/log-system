import { Pie } from "@visx/shape";
import { scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";

// 접근자 함수
const getValue = (d: { value: number }) => d.value;
// const getLabel = (d: { label: string }) => d.label;

interface Props {
  data: { label: string; value: number }[] | undefined;
  width: number;
  height: number;
  target: string;
  setPieTarget: (v: string) => void;
}

const PieChart = ({ width, height, data, target, setPieTarget }: Props) => {
  // 색상 스케일 정의
  const colorScale = scaleOrdinal({
    domain: data?.map(d => d.label),
    range: [
      "#ff4b4b",
      "#ffc12f",
      "#ffe437",
      "#43e037",
      "#39ff6a",
      "#3affd4",
      "#185dff",
      "#b547ff",
      "#000000",
    ],
  });
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        <Pie
          data={data}
          pieValue={getValue}
          outerRadius={radius - 10}
          innerRadius={radius - 50}
          padAngle={0.02}
          cornerRadius={3}
          onClick={v => console.log(v)}
        >
          {pie =>
            pie.arcs.map(arc => (
              <g
                key={arc.data.label}
                className=" cursor-pointer"
                dataset-target={arc.data.label}
                onClick={() => {
                  if (target === arc.data.label) {
                    setPieTarget("");
                    return;
                  }
                  setPieTarget(arc.data.label);
                }}
              >
                <path
                  d={pie.path(arc) || ""}
                  fill={colorScale(arc.data.label)}
                  stroke={
                    target === ""
                      ? "black" // target이 -1일 때의 색상
                      : arc.data.label === target
                        ? "black" // 기존 조건
                        : ""
                  } // 기본 색상}
                  strokeWidth={2}
                />
                <text
                  transform={`translate(${pie.path.centroid(arc)})`}
                  dy=".33em"
                  fontSize={10}
                  textAnchor="middle"
                  fill={
                    target === ""
                      ? "black" // target이 -1일 때의 색상
                      : arc.data.label === target
                        ? "black" // 기존 조건
                        : "#ffffff"
                  } // 기본 색상}
                >
                  {arc.data.label.toLocaleUpperCase()}
                </text>
              </g>
            ))
          }
        </Pie>
      </Group>
    </svg>
  );
};

export default PieChart;
