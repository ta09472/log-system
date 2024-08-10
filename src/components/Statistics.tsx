import {
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "@visx/xychart";
import {
  Button,
  Card,
  Collapse,
  CollapseProps,
  Divider,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Popover,
  Select,
  Spin,
  Switch,
} from "antd";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { useState } from "react";
import "../override.css";
import { Aggregation } from "../schema/aggregation";

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

const items: MenuProps["items"] = [
  {
    label: <a href="https://www.antgroup.com">1st menu item</a>,
    key: "0",
  },
  {
    label: <a href="https://www.aliyun.com">2nd menu item</a>,
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

export default function Statistics() {
  const [editable, setEditable] = useState(false);
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
    queryFn: () => api.aggregation.getCondition(target?.topicName ?? ""),
    onSuccess: v => setForm(v?.data),
    // enabled: !!topics,
  });

  const { data: realTimeData } = useQuery({
    queryKey: ["realtime", target?.topicName],
    queryFn: () => api.aggregation.getRealtimeData(target?.topicName ?? ""),
  });

  console.log(realTimeData?.data);

  const isExist = aggregationCondition?.data.length === 0;

  const dataFiledOptions = target?.fields.map(({ fieldName }) => ({
    label: fieldName,
    value: fieldName,
  }));

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
          {/* <div>{realTimeData?.data.result.length}</div> */}

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
      <Modal
        width={"50rem"}
        open={open}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        onCancel={() => setOpen(false)}
        okText="Save"
        centered
        title={
          <div className=" font-bold text-xl flex items-center justify-center mt-4">
            Aggregation Setting
          </div>
        }
      >
        <div className=" flex flex-col gap-2">
          <div className=" flex justify-between mt-8">
            <div className=" font-semibold text-lg">Manage Schema</div>

            <Button
              type="text"
              className=" bg-neutral-100"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              }
            >
              Create a schema field
            </Button>
          </div>
          <div className=" text-neutral-500">
            어쩌구 저쩌구 이런 저런 일을 할 수 있습니다.
          </div>
          <Divider />
          <div className=" flex flex-col min-h-[30rem]">
            <div className=" flex items-center justify-between">
              <div>Schema Name</div>
              <div style={{ position: "relative" }}>
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  openClassName="slide-down-animation"
                  rootClassName="slide-down-animation"
                  overlayClassName="slide-down-animation"
                  getPopupContainer={
                    triggerNode => triggerNode
                    // triggerNode.closest("#target")
                  }
                >
                  <div className=" cursor-pointer" id="target">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                      />
                    </svg>
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className=" flex mt-4">
              <div className="text-neutral-500 basis-4/12 flex items-center">
                Field Name
              </div>
              <div className="text-neutral-500 basis-4/12 flex items-center">
                Keyword
              </div>
              <div className="text-neutral-500 basis-4/12 flex items-center">
                Match Criteria
              </div>
              <div className="text-neutral-500 basis-2/12 text-end ">
                <Button
                  type="text"
                  className=" bg-neutral-100"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  }
                >
                  Add Field
                </Button>
              </div>
            </div>
          </div>
          {/* <div className="flex-col gap-2 flex py-1">
            {form?.map(v => (
              <div
                className=" w-full flex gap-2 items-center"
                key={`${v.settingName}`}
              >
                <div className=" basis-2/12">{v.settingName}</div>
                {v.condition.map((el, id) => {
                  return (
                    <div
                      key={`${el.fieldName}_${el.keyword}_${id}`}
                      className=" flex items-center flex-col gap-1"
                    >
                      <Select
                        variant="filled"
                        className="basis-2/12"
                        options={dataFiledOptions}
                        // onChange={v => onFieldChange(v, id)}
                        value={el.fieldName}
                      />
                      <Input
                        variant="filled"
                        value={el.keyword}
                        className="basis-5/12"
                        placeholder="Enter the keyword you are looking for"
                        // onChange={({ currentTarget }) =>
                        //   onKeywordChange(currentTarget.value, id)
                        // }
                      />
                      <Switch
                        value={el.equal}
                        className="basis-2/12"
                        checkedChildren="Exactly"
                        unCheckedChildren="Contains"
                        defaultChecked
                        // onChange={v => onCriteriaChange(v, id)}
                      />
                      <Button
                        className="text-neutral-500 basis-1/12"
                        type="text"
                        onClick={() => {
                          // removeCondition(id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div> */}
        </div>
      </Modal>
    </Card>
  );
}
