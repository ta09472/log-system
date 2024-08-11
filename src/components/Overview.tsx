import { Button, Card, Divider } from "antd";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { useState } from "react";
import "../override.css";
import Description from "./Description";
import useWebSocket from "../hook/useWebSocket";
import WorkspaceEditModal from "./WorkspaceEditModal";
import {
  getPeakTimes,
  mergeArraysBySettingName,
  transformData,
} from "../util/format";
import dayjs from "dayjs";

export default function Overview() {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const [open, setOpen] = useState(false);

  const target = data?.data.find(datum => datum.id.toString() === workspaceId);

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

  console.log(getPeakTimes(mergedData));
  return (
    <div className="flex flex-col gap-3 h-full">
      <Card bordered={false} className="flex-col">
        <div className="flex justify-between items-center">
          <div className="font-bold text-2xl">Topic Info</div>
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

        <Description
          value={target?.topicName}
          label="Name"
          tooltip={{ text: "대충 토픽이 뭔지에 대한 설명" }}
        />
        <Description
          value={
            target?.topicDescription.length === 0
              ? "There is no Description."
              : target?.topicDescription
          }
          label="Description"
          tooltip={{ text: "이 토픽에 대해 사용자가 작성한 설명입니다." }}
        />

        <Divider className=" my-2" />
        <div>
          <Description
            label="Data Fields"
            tooltip={{ text: "대충 데이터 필드에 대한 설명" }}
          />
          {target?.fields.map((v, id) => {
            return (
              <Description
                key={id}
                label={
                  <div className=" text-[0.8rem] pl-4">
                    {id + 1}. Name / Type
                  </div>
                }
                value={
                  <div className=" text-[0.8rem] pl-4">{`${v.fieldName} / ${v.fieldType}`}</div>
                }
              />
            );
          })}
        </div>
      </Card>

      <Card bordered={false} className="flex-1  max-h-[37.3rem]">
        <div className="font-bold text-2xl">Overview</div>
        <div className=" text-neutral-500">
          Frequency Count (during the last hour)
        </div>
        <div className=" flex mt-4 gap-2">
          <div className="text-neutral-500 basis-10/12 flex items-center text-sm">
            Name
          </div>
          <div className="text-neutral-500 basis-2/12 flex items-center text-sm">
            Count
          </div>
        </div>
        <div className=" flex flex-col gap-2 mt-4 overflow-scroll  max-h-[10rem]">
          {lineData
            .sort((a, b) => b.data.length - a.data.length)
            .map(v => {
              return (
                <div className=" flex justify-between items-center">
                  <div className=" text-md basis-10/12">
                    {v.settingName.toLocaleUpperCase()}
                  </div>
                  <div className=" text-md basis-2/12">{v.data.length}</div>
                </div>
              );
            })}
        </div>
        <Divider />
        <div className=" text-neutral-500 mt-4">
          Peak Frequency (during the last hour)
        </div>
        <div className=" flex mt-4 gap-2">
          <div className="text-neutral-500 basis-4/12 flex items-center text-sm">
            Name
          </div>
          <div className="text-neutral-500 basis-6/12 flex items-center text-sm">
            Time
          </div>
          <div className="text-neutral-500 basis-2/12 flex items-center text-sm">
            Count
          </div>
        </div>
        <div className=" overflow-scroll  max-h-[11rem]">
          {getPeakTimes(mergedData).map(v => {
            return (
              <div className=" flex mt-4 gap-2">
                <div className="basis-4/12 flex items-center">
                  {v?.settingName?.toLocaleUpperCase()}
                </div>
                <div className="basis-6/12 flex items-center">
                  {dayjs(v.peak.timestamp ?? "").format("HH:mm:ss A")}
                </div>
                <div className="basis-2/12 flex items-center">
                  {v.peak.count}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <WorkspaceEditModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
