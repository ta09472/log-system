import { Button, Card, DatePicker, Table } from "antd";
import { useMutation } from "react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../api";
import { scaleOrdinal } from "@visx/scale";
import { ReactNode, useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { LogAggregationParams } from "../schema/aggregation";
import dayjs from "dayjs";
import {
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "@visx/xychart";
import { colorAccessor, colorPallet } from "../util/color";
import { LegendItem, LegendLabel, LegendOrdinal } from "@visx/legend";
import { getDateFormat } from "../util/dateRange";
import { scaleTime } from "d3-scale";
import PieChart from "./Pie";

type AggForm = LogAggregationParams & { searchType: "raw" | "statics" };

const initialForm: AggForm = {
  topicName: "",
  searchType: "statics",
  from: dayjs().subtract(1, "day").toISOString(),
  to: dayjs().toISOString(),
  searchSettings: [
    {
      settingName: "",
      conditionList: [{ fieldName: "", keyword: "", equal: true }],
    },
  ],
};

const accessors = {
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y,
};

export default function AggregationResult() {
  const [searchParams] = useSearchParams();
  const { search } = useLocation();
  const [id, setId] = useState(0);

  const topicName = searchParams.get("topicName") ?? initialForm.topicName;
  const from = searchParams.get("start") ?? initialForm.from;
  const to = searchParams.get("end") ?? initialForm.to;
  const searchSettings =
    JSON.parse(searchParams.get("aggConditions") ?? "") ??
    initialForm.searchSettings;

  const { mutateAsync, isLoading, data } = useMutation(
    api.aggregation.getAggregationData
  );

  useEffect(() => {
    mutateAsync({
      topicName,
      from,
      to,
      searchSettings,
    });
  }, [search]);

  const lineData = data?.data?.result.map(v => {
    return {
      ...v,
      data: v.data.map(d => ({
        y: d.count,
        x: dayjs(d.timestamp).format(getDateFormat(dayjs(from), dayjs(to))),
      })),
    };
  });

  const colorScale = scaleOrdinal({
    domain: lineData?.map(v => v.settingName),
    range: colorPallet,
  });

  // const getTicks = () => {
  //   const start = dayjs(from);
  //   const end = dayjs(to);
  //   const diffInMinutes = end.diff(start, "minute");
  //   const diffInHours = end.diff(start, "hour");
  //   const diffInDays = end.diff(start, "day");

  //   if (diffInMinutes <= 1) {
  //     // 1분 이내일 때
  //     return 60;
  //   } else if (diffInHours <= 1) {
  //     // 1시간 이내일 때
  //     return 60;
  //   } else if (diffInDays <= 1) {
  //     // 1일 이내일 때
  //     return 24;
  //   } else {
  //     // 1일 이상일 때
  //     return undefined;
  //   }
  // };
  // const ticks = getTicks();

  const tabPanel: {
    [key: number]: ReactNode;
  } = {
    0: (
      <div className=" h-full p-4">
        <div className=" mt-2">
          <LegendOrdinal
            scale={colorScale}
            labelFormat={label => `${label.toUpperCase()}`}
          >
            {labels => (
              <div style={{ display: "flex", flexDirection: "row" }}>
                {labels.map((label, i) => (
                  <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
                    <svg width={10} height={10}>
                      <rect fill={label.value} width={10} height={10} />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px">
                      {label.text}
                    </LegendLabel>
                  </LegendItem>
                ))}
              </div>
            )}
          </LegendOrdinal>
        </div>
        <XYChart
          height={250}
          xScale={{ type: "band" }}
          yScale={{ type: "linear" }}
        >
          <AnimatedAxis
            orientation="bottom"
            // tickFormat={date => dayjs(date).format("YYYY")}
            // numTicks={ticks}
          />
          <AnimatedAxis orientation="left" />

          <AnimatedGrid columns={false} numTicks={4} />
          {lineData?.map((v, id) => {
            return (
              <AnimatedLineSeries
                color={colorScale(v.settingName)}
                colorAccessor={() => colorAccessor(id)}
                dataKey={v.settingName}
                data={v.data}
                {...accessors}
              />
            );
          })}
        </XYChart>
      </div>
    ),
    1: (
      <div className=" h-full p-4">
        <div className=" mt-2">
          <LegendOrdinal
            scale={colorScale}
            labelFormat={label => `${label.toUpperCase()}`}
          >
            {labels => (
              <div style={{ display: "flex", flexDirection: "row" }}>
                {labels.map((label, i) => (
                  <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
                    <svg width={10} height={10}>
                      <rect fill={label.value} width={10} height={10} />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px">
                      {label.text}
                    </LegendLabel>
                  </LegendItem>
                ))}
              </div>
            )}
          </LegendOrdinal>
        </div>
        <XYChart
          height={250}
          xScale={{ type: "band" }}
          yScale={{ type: "linear" }}
        >
          <AnimatedAxis orientation="left" />
          <AnimatedAxis orientation="bottom" />
          <AnimatedGrid columns={false} numTicks={4} />
          {lineData?.map((v, id) => {
            return (
              <AnimatedBarSeries
                colorAccessor={() => colorAccessor(id)}
                dataKey={v.settingName}
                data={v.data}
                {...accessors}
              />
            );
          })}
        </XYChart>
      </div>
    ),
    2: (
      <div className=" h-full p-4">
        <div className=" mt-2">
          <LegendOrdinal
            scale={colorScale}
            labelFormat={label => `${label.toUpperCase()}`}
          >
            {labels => (
              <div style={{ display: "flex", flexDirection: "row" }}>
                {labels.map((label, i) => (
                  <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
                    <svg width={10} height={10}>
                      <rect fill={label.value} width={10} height={10} />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px">
                      {label.text}
                    </LegendLabel>
                  </LegendItem>
                ))}
              </div>
            )}
          </LegendOrdinal>
        </div>
        <div className=" flex justify-around">
          <PieChart width={250} height={250} />
          <div>hello</div>
        </div>
      </div>
    ),
  };

  return (
    <Layout>
      <div className=" flex flex-col">
        <div className=" text-xl font-bold">조건</div>
        {/* <DatePicker.RangePicker showTime /> */}
      </div>

      {/* <Card bordered={false} className="" loading={isLoading}></Card>
       */}

      <div className="w-full h-full bg-white rounded-md shadow-sm">
        <div className=" rounded-t-md">
          <div className="flex border-b-[0.1rem] border-neutral-100 bg-neutral-50 rounded-t-md">
            {["Trend", "Comparison", "Frequency"].map((v, index) => (
              <div
                key={v}
                className={`first:rounded-tl-md min-w-[14rem] p-4 min-h-[6rem] flex-col border-r-[0.1rem] cursor-pointer ${
                  id === index
                    ? "bg-white border-b-neutral-700 border-b-[0.2rem] "
                    : ""
                }`}
                onClick={() => setId(index)}
              >
                <div className="text-neutral-500 font-semibold">{v}</div>
                <div>대충 숫잔</div>
              </div>
            ))}
          </div>
          {tabPanel[id]}
        </div>
      </div>
      <div className=" flex gap-2 w-full">
        <Card title="대충 전체 표" className="w-full">
          <Table />
        </Card>
      </div>
    </Layout>
  );
}
