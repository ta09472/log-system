import {
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "@visx/xychart";
import { Button, Card, Divider, Popover, Spin } from "antd";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { useState } from "react";
import "../override.css";
import { Aggregation } from "../schema/aggregation";

import AggregationEditModal from "./AggregationEditModal";

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

const initialForm: Aggregation = {
  topicName: "",
  settingName: "",
  condition: [
    {
      fieldName: "",
      keyword: "",
      equal: true,
    },
  ],
};
export default function Statistics() {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<undefined | Aggregation[]>();

  const { mutate } = useMutation(api.aggregation.createCondition);

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

  // console.log(realTimeData?.data);

  const isExist = aggregationCondition?.data.length === 0;

  const onChange = (v: Aggregation[]) => {
    setForm(v);
  };

  // const options = data?.data.map(v => ({
  //   label: v.topicName,
  //   value: v.topicName,
  // }));

  // form 이렇게 생김
  // {
  //   "topicName": "string",
  //   "settingName": "string",
  //   "condition": [
  //     {
  //       "fieldName": "string",
  //       "keyword": "string",
  //       "equal": true
  //     }
  //   ]
  // }

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
            시간에 따른 로그 발생(트렌드)
          </div>
          <div className="  min-h-[250px]">
            <XYChart
              height={250}
              xScale={{ type: "band" }}
              yScale={{ type: "linear" }}
            >
              <AnimatedAxis orientation="bottom" />
              <AnimatedGrid columns={false} numTicks={4} />
              <AnimatedLineSeries
                dataKey="Line 1"
                data={data1}
                {...accessors}
              />
              <AnimatedLineSeries
                dataKey="Line 2"
                data={data2}
                {...accessors}
              />
            </XYChart>
          </div>
          <Divider />
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
