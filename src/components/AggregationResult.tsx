import { Button, Card, Table } from "antd";
import { useMutation } from "react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../api";
import { scaleOrdinal } from "@visx/scale";
import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { LogAggregationParams } from "../schema/aggregation";
import dayjs from "dayjs";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "@visx/xychart";
import { colorAccessor, colorPallet } from "../util/color";
import { LegendItem, LegendLabel, LegendOrdinal } from "@visx/legend";
import { getDateFormat } from "../util/dateRange";

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

  console.log(lineData);

  return (
    <Layout>
      <div className=" text-xl font-bold">AGG 검색 조건</div>
      {/* <Card bordered={false} className="" loading={isLoading}></Card>
       */}

      <div className="w-full h-full bg-white rounded-md shadow-sm">
        <div className=" rounded-t-md">
          <div className="flex border-b-[0.1rem] border-neutral-100 bg-neutral-50 rounded-t-md">
            {["Trend", "Comparison", 3].map((v, index) => (
              <div
                key={v}
                className={`first:rounded-tl-md min-w-[14rem] p-4 min-h-[7rem] flex-col border-r-[0.1rem] cursor-pointer ${
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
        </div>
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
            <AnimatedAxis orientation="bottom" />
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
      </div>
      <div className=" flex gap-2 w-full">
        <Card className=" basis-1/2 flex flex-col " title="대충 오름차순 정렬">
          <Table />
        </Card>
        <Card className=" basis-1/2" title="대충 전체 표">
          <Table />
        </Card>
      </div>
    </Layout>
  );
}
