import React from "react";
import { Pie } from "@visx/shape";
import { scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";

// 데이터 및 색상 정의
const data = [
  { label: "A", value: 10 },
  { label: "B", value: 20 },
  { label: "C", value: 30 },
  { label: "D", value: 40 },
];

// 색상 스케일 정의
const colorScale = scaleOrdinal({
  domain: data.map(d => d.label),
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

// 접근자 함수
const getValue = (d: { value: number }) => d.value;
// const getLabel = (d: { label: string }) => d.label;

const PieChart = ({ width, height }: { width: number; height: number }) => {
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
          padAngle={0.01}
          cornerRadius={3}
        >
          {pie =>
            pie.arcs.map(arc => (
              <g key={arc.data.label}>
                <path
                  d={pie.path(arc) || ""}
                  fill={colorScale(arc.data.label)}
                />
                <text
                  transform={`translate(${pie.path.centroid(arc)})`}
                  dy=".33em"
                  fontSize={10}
                  textAnchor="middle"
                  fill="#fff"
                >
                  {arc.data.label}
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
