import {
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "@visx/xychart";
import { LegendItem, LegendLabel, LegendOrdinal } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";

import { Button, Card, Divider, Popover, Spin } from "antd";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { useState } from "react";
import "../override.css";
import { Aggregation } from "../schema/aggregation";

import AggregationEditModal from "./AggregationEditModal";
import useWebSocket from "../hook/useWebSocket";
import dayjs from "dayjs";

const colorPallet = [
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

const accessors = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
};

const colorAccessor = id => {
  return colorPallet.at(id) || "#000000"; // 색상이 정의되지 않은 경우 기본 색상으로 검정색을 사용
};

const mergeArraysBySettingName = ({
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

const transformData = (
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

export default function Statistics() {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<undefined | Aggregation[]>();

  const { data: topics } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const target = topics?.data.find(
    datum => datum.id.toString() === workspaceId
  );

  const { data: aggregationCondition, isLoading } = useQuery({
    queryKey: ["aggCondition", target?.topicName],
    refetchOnWindowFocus: false,
    queryFn: () => api.aggregation.getCondition(target?.topicName ?? ""),
    onSuccess: v => setForm(v?.data),
    // enabled: !!topics,
  });

  const { data: realTimeData } = useQuery({
    queryKey: ["realtime", target?.topicName],
    queryFn: () => api.aggregation.getRealtimeData(target?.topicName ?? ""),
  });

  const { message: agg } = useWebSocket({
    topicName: target?.topicName ?? "",
    searchType: "agg",
  });

  const mergedData = mergeArraysBySettingName({
    arr1: realTimeData?.data.result,
    arr2: agg.result,
  });

  const lineData = transformData(mergedData);
  const colorScale = scaleOrdinal({
    domain: lineData.map(v => v.settingName),
    range: colorPallet,
  });

  const isExist = aggregationCondition?.data.length === 0;

  const onChange = (v: Aggregation[]) => {
    setForm(v);
  };

  if (isLoading)
    return (
      <Card
        bordered={false}
        className=" h-full flex items-center justify-center"
      >
        <Spin />
      </Card>
    );

  return (
    <Card
      bordered={false}
      className="h-full flex flex-col"
      classNames={{
        body: "h-full flex flex-col",
      }}
    >
      <div className="text-2xl font-bold flex items-center justify-between">
        <div className=" flex items-center gap-2">
          <div>Aggregation Results</div>
          <Popover
            content={
              <div className=" text-xs text-neutral-500">
                This shows the trends in data for the hour leading up to the
                page load.
              </div>
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#8e8e8e"
              className="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
          </Popover>
        </div>
        <Button type="text" onClick={() => setOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </Button>
      </div>
      {!isExist ? (
        <>
          <Divider />
          <div className=" font-bold text-lg">
            Trend from last hour's log data
          </div>
          <div className="  min-h-[250px]">
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
              {lineData.map((v, id) => {
                return (
                  <AnimatedLineSeries
                    // color={colorScale(v.settingName)}
                    colorAccessor={() => colorAccessor(id)}
                    dataKey={v.settingName}
                    data={v.data}
                    {...accessors}
                  />
                );
              })}
            </XYChart>
          </div>
          <Divider />
          <div className=" font-bold text-lg">
            Log Occurrences over the past hour
          </div>
          <div className="  min-h-[250px]">
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
              {lineData.map((v, id) => {
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
        </>
      ) : (
        <div className=" text-neutral-500 flex items-center justify-center h-full">
          Please set the aggregation conditions.
        </div>
      )}
      <AggregationEditModal
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        onChange={onChange}
      />
    </Card>
  );
}
