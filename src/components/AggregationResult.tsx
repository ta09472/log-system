import { Divider, Table } from "antd";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xAccessor: (d: any) => d.x,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yAccessor: (d: any) => d.y,
};

export default function AggregationResult() {
  const [searchParams] = useSearchParams();
  const { search } = useLocation();
  const [id, setId] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  const topicName = searchParams.get("topicName") ?? initialForm.topicName;
  const from = searchParams.get("start") ?? initialForm.from;
  const to = searchParams.get("end") ?? initialForm.to;
  const searchSettings =
    JSON.parse(searchParams.get("aggConditions") ?? "") ??
    initialForm.searchSettings;

  const { mutateAsync, data } = useMutation(api.aggregation.getAggregationData);

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

  const filteredData = lineData?.map(setting => ({
    settingName: setting.settingName,
    data: setting.data.filter(item => item.y !== 0),
  }));

  const sumData = filteredData?.map(setting => ({
    settingName: setting.settingName,
    total: setting.data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.y;
    }, 0),
  }));

  const pieData = sumData?.map(v => ({ label: v.settingName, value: v.total }));

  const transformedData = filteredData?.flatMap(item =>
    item.data.map(d => ({
      settingName: item.settingName.toLocaleUpperCase(),
      x: d.x,
      y: d.y,
    }))
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "settingName",
      key: "settingName",
    },
    {
      title: "Time",
      dataIndex: "x",
      key: "time",
    },
    {
      title: "Count",
      dataIndex: "y",
      key: "count",
    },
  ];

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
                  <LegendItem
                    className={
                      label.datum.toLocaleUpperCase() ===
                      selectedOption.toLocaleUpperCase()
                        ? " bg-neutral-200 cursor-pointer hover:bg-neutral-200 rounded-md p-1 shadow-sm"
                        : " cursor-pointer hover:bg-neutral-200 rounded-md p-1"
                    }
                    key={`legend-quantile-${i}`}
                    margin="0 5px"
                    onClick={() => {
                      if (label.datum === selectedOption) {
                        setSelectedOption("");
                        return;
                      }
                      setSelectedOption(label.datum);
                    }}
                  >
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
          {(lineData?.filter(q => q.settingName === selectedOption).length === 0
            ? lineData // 필터링된 데이터가 없으면 원본 데이터 반환
            : lineData?.filter(q => q.settingName === selectedOption)
          )?.map((v, id) => (
            <AnimatedLineSeries
              key={id} // 각 요소에 고유한 키를 제공
              color={colorScale(v.settingName)}
              colorAccessor={() => colorAccessor(id)}
              dataKey={v.settingName}
              data={v.data}
              {...accessors}
            />
          ))}
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
                  <LegendItem
                    className={
                      label.datum.toLocaleUpperCase() ===
                      selectedOption.toLocaleUpperCase()
                        ? " bg-neutral-200 cursor-pointer hover:bg-neutral-200 rounded-md p-1 shadow-sm"
                        : " cursor-pointer hover:bg-neutral-200 rounded-md p-1"
                    }
                    key={`legend-quantile-${i}`}
                    margin="0 5px"
                    onClick={() => {
                      if (label.datum === selectedOption) {
                        setSelectedOption("");
                        return;
                      }
                      setSelectedOption(label.datum);
                    }}
                  >
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
          {(lineData?.filter(q => q.settingName === selectedOption).length === 0
            ? lineData // 필터링된 데이터가 없으면 원본 데이터 반환
            : lineData?.filter(q => q.settingName === selectedOption)
          )?.map((v, id) => (
            <AnimatedBarSeries
              key={id} // 각 요소에 고유한 키를 제공
              // color={colorScale(v.settingName)}
              colorAccessor={() => colorAccessor(id)}
              dataKey={v.settingName}
              data={v.data}
              {...accessors}
            />
          ))}
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
                  <LegendItem
                    className={
                      label.datum.toLocaleUpperCase() ===
                      selectedOption.toLocaleUpperCase()
                        ? " bg-neutral-200 cursor-pointer hover:bg-neutral-200 rounded-md p-1 shadow-sm"
                        : " cursor-pointer hover:bg-neutral-200 rounded-md p-1"
                    }
                    key={`legend-quantile-${i}`}
                    margin="0 5px"
                    onClick={() => {
                      if (label.datum === selectedOption) {
                        setSelectedOption("");
                        return;
                      }
                      setSelectedOption(label.datum);
                    }}
                  >
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
        <div className=" flex">
          <div className="  flex justify-center ">
            <PieChart
              width={250}
              height={250}
              data={
                pieData?.filter(v => v.label === selectedOption).length === 0
                  ? pieData
                  : pieData?.filter(v => v.label === selectedOption)
              }
            />
          </div>
        </div>
      </div>
    ),
  };

  return (
    <Layout>
      <div className=" flex flex-col">
        <div className=" text-xl font-bold">조건</div>
      </div>

      <div className="w-full h-full bg-white rounded-md shadow-sm">
        <div className=" rounded-t-md">
          <div className="flex border-b-[0.1rem] border-neutral-100 bg-neutral-50 rounded-t-md">
            {["Trend", "Comparison", "Frequency"].map((v, index) => (
              <div
                key={v}
                className={`first:rounded-tl-md min-w-[14rem] p-4 min-h-[4rem] flex-col border-r-[0.1rem] cursor-pointer ${
                  id === index
                    ? "bg-white border-b-neutral-700 border-b-[0.2rem] "
                    : ""
                }`}
                onClick={() => setId(index)}
              >
                <div className="text-neutral-600 font-semibold">{v}</div>
                <div className=" text-neutral-400 text-sm">
                  {[
                    "Trend of Occurrence for Search Results",
                    "Comparison Groups for Search Results",
                    "Frequency of Search Results",
                  ].at(index)}
                </div>
              </div>
            ))}
          </div>
          {tabPanel[id]}
        </div>
        <Divider className="" />
        <div className=" px-6 flex flex-col">
          <div className=" text-neutral-800 text-xl font-bold">전체 표</div>
          <Table
            scroll={{ y: 210 }}
            columns={columns}
            dataSource={
              (
                transformedData?.filter(
                  c => c.settingName === selectedOption.toLocaleUpperCase()
                ) || []
              ).length > 0
                ? transformedData?.filter(
                    c => c.settingName === selectedOption.toLocaleUpperCase()
                  )
                : transformedData
            }
          />
        </div>
      </div>
    </Layout>
  );
}
