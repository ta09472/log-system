import { Button, Card, Divider, Statistic } from "antd";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { useState } from "react";
import "../override.css";

import Description from "./Description";
import useWebSocket from "../hook/useWebSocket";
// import dayjs from "dayjs";
import WorkspaceEditModal from "./WorkspaceEditModal";

export default function Overview() {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const ws = useWebSocket();

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const [open, setOpen] = useState(false);

  const target = data?.data.find(datum => datum.id.toString() === workspaceId);

  // console.log(dayjs(ws.message.timestamp).format("YYYY-MM-DD HH:mm:ss"));

  console.log(ws.message);
  return (
    <div className="flex gap-2">
      <Card bordered={false} className="basis-1/5">
        <Statistic
          title="최근 1시간 동안의 발생 로그 개수"
          value={110}
          valueStyle={{ color: "#000000" }}
        />
      </Card>
      <Card bordered={false} className="basis-1/5">
        <Statistic
          title="최근 1시간 동안의 발생 에러 개수"
          value={4}
          valueStyle={{ color: "#b02c2c" }}
        />
      </Card>
      <Card bordered={false} className="flex-1">
        <Statistic
          title="Active"
          value={11.28}
          valueStyle={{ color: "#3f8600" }}
        />
      </Card>
      <Card bordered={false} className="flex-1 flex-col">
        <div className="flex justify-between items-center">
          <div className=" font-bold text-lg">Topic Info</div>
          <Button type="text" onClick={() => setOpen(true)}>
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
              ? "토픽 설명이 없습니다."
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
      <WorkspaceEditModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
