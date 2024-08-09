import {
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "@visx/xychart";
import { Button, Card } from "antd";

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
  // /api/aggregation/list/{topicName} 이거 조회해서 없으면 아래꺼 렌더링

  // return (
  //   <Card bordered={false} className=" h-full flex items-center justify-center">
  //     <Button type="primary">Edit</Button>
  //   </Card>
  // );
  return (
    <div className="flex flex-col gap-3">
      <Card bordered={false} className=" flex flex-col gap-1 pt-[0.1rem]">
        <div>통계 개요</div>
        <div>
          통계 설정이 없을 때는 하나의 카드로 보여주고 가운데에 설정버튼을 둔다
        </div>
        <div>버튼 누르면 모달열기</div>
      </Card>
      <Card className=" basis-3/6" bordered={false}>
        <div className=" font-bold text-lg">시간에 따른 로그 발생(트렌드)</div>
        <div className="  min-h-[250px]">
          <XYChart
            height={250}
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
      <Card className=" basis-2/6" bordered={false}>
        <div className=" font-bold text-lg">로그 발생 횟수(갯수)</div>
        <div className="  min-h-[250px]">
          <XYChart
            height={250}
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
