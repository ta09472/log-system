import {
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "@visx/xychart";
import { Card } from "antd";

const data1 = [
  { x: "2020-01-01", y: 50 },
  { x: "2020-01-02", y: 10 },
  { x: "2020-01-03", y: 20 },
];

const data2 = [
  { x: "2020-01-01", y: 30 },
  { x: "2020-01-02", y: 40 },
  { x: "2020-01-03", y: 80 },
];

const accessors = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
};

export default function Statistics() {
  return (
    <div className="flex gap-3">
      <Card className=" basis-2/3" bordered={false}>
        <div className=" font-bold text-lg">시간에 따른 로그 발생(트렌드)</div>
        <div className="  min-h-[20rem]">
          <XYChart
            height={300}
            xScale={{ type: "band" }}
            yScale={{ type: "linear" }}
          >
            <AnimatedAxis orientation="bottom" />
            <AnimatedGrid columns={false} numTicks={4} />
            <AnimatedLineSeries dataKey="Line 1" data={data1} {...accessors} />
            <AnimatedLineSeries dataKey="Line 2" data={data2} {...accessors} />
          </XYChart>
        </div>
      </Card>
      <Card className=" basis-1/3" bordered={false}>
        <div className=" font-bold text-lg">로그 발생 횟수(갯수)</div>
        <div className="  min-h-[20rem]">
          <XYChart
            height={300}
            xScale={{ type: "band" }}
            yScale={{ type: "linear" }}
          >
            <AnimatedAxis orientation="bottom" />
            <AnimatedGrid columns={false} numTicks={4} />
            <AnimatedBarSeries
              dataKey="Line 1"
              data={data1}
              {...accessors}
              colorAccessor={d => "#3e3e3e"}
            />
          </XYChart>
        </div>
      </Card>
    </div>
  );
}
