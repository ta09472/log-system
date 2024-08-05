import { Button, Card, Input, Modal, Select, Statistic } from "antd";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { useState } from "react";

const options = ["string", "integer"];

export default function Overview() {
  const [searchParams] = useSearchParams();

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const [open, setOpen] = useState(false);

  const target = data?.data.find(
    datum => datum.id.toString() === searchParams.get("workspace")
  );
  // const ws = new WebSocket("ws://14.55.157.117:8080/ws");

  // console.log(ws);

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
          <div className=" font-bold text-lg">토픽 정보</div>
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

        <div>이름: {target?.topicName}</div>
        <div>
          설명 :
          {target?.topicDescription.length === 0
            ? "토픽 설명이 없습니다."
            : target?.topicDescription}
        </div>
        <div>필드: </div>
      </Card>
      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        title="토픽 수정"
      >
        <div className="flex flex-col gap-2 mt-8">
          <div className="flex gap-2">
            <div className="min-w-20">토픽 이름</div>
            <Input value={target?.topicName} />
          </div>
          <div className="flex gap-2">
            <div className="min-w-20">토픽 설명</div>
            <Input value={target?.topicDescription} />
          </div>
          <div className="flex gap-2 items-center">
            <div className="min-w-20">토픽 필드</div>
            <Select />
          </div>
        </div>
      </Modal>
    </div>
  );
}
