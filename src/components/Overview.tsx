import { Button, Card, Input, Modal, Select, Statistic } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { useEffect, useState } from "react";

import { Topic } from "../schema/topic";
import { PutTopicParams } from "../api/topic";
import Description from "./Description";

const options = [
  { value: "string", label: "string" },
  { value: "integer", label: "integer" },
  { value: "long", label: "long" },
  { value: "float", label: "float" },
  { value: "double", label: "double" },
];

export default function Overview() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const [open, setOpen] = useState(false);

  const target = data?.data.find(datum => datum.id.toString() === workspaceId);
  const [params, setParams] = useState<Topic | undefined>(target);

  useEffect(() => {
    // WebSocket 연결 설정
    const socket = new WebSocket("ws://14.55.157.117:8080/ws");

    // WebSocket 연결이 열릴 때
    socket.onopen = () => {
      console.log("WebSocket connected");
      // setWs(socket);
    };

    // WebSocket 메시지를 받을 때
    socket.onmessage = event => {
      const message = event.data;
      // setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message);
    };

    // WebSocket 연결이 닫힐 때
    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // WebSocket 오류 발생 시
    socket.onerror = error => {
      console.error("WebSocket error:", error);
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 닫기
    return () => {
      socket.close();
    };
  }, []);

  const { mutate: editTopic, isLoading } = useMutation({
    mutationFn: api.topic.editTopic,
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard"]);
    },
  });

  const onSubmit = () => {
    if (!params) return;

    editTopic(params as PutTopicParams);
    setOpen(false);
  };

  const onChange = (v: string, key: string) => {
    switch (key) {
      case "topicName":
        setParams(prev => {
          return { ...prev, topicName: v } as Topic;
        });
        break;
      case "topicDescription":
        setParams(prev => {
          return { ...prev, topicDescription: v } as Topic;
        });
        break;
      case "fields":
        setParams(prev => {
          return { ...prev, fields: v } as Topic;
        });
        break;
      default:
        break;
    }
  };

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

        <Description
          value={target?.topicName}
          label="토픽명"
          tooltip={{ text: "대충 토픽이 뭔지에 대한 설명" }}
        />
        <Description
          value={
            target?.topicDescription.length === 0
              ? "토픽 설명이 없습니다."
              : target?.topicDescription
          }
          label="토픽설명"
          tooltip={{ text: "이 토픽에 대해 사용자가 작성한 설명입니다." }}
        />

        <div>
          <Description
            label="데이터 필드"
            tooltip={{ text: "대충 데이터 필드에 대한 설명" }}
          />
          {target?.fields.map((v, id) => {
            return (
              <Description
                label={
                  <div className=" text-[0.8rem] pl-4">
                    {id + 1}.이름 / 유형
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
      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        title="토픽 수정"
        loading={isLoading}
      >
        <div className="flex flex-col gap-2 mt-8">
          <div className="flex gap-2">
            <div className="min-w-20">토픽 이름</div>
            <Input
              disabled
              value={params?.topicName}
              onChange={({ target }) => onChange(target.value, "topicName")}
            />
          </div>
          <div className="flex gap-2">
            <div className="min-w-20">토픽 설명</div>
            <Input
              value={params?.topicDescription}
              onChange={({ target }) =>
                onChange(target.value, "topicDescription")
              }
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="min-w-20">토픽 필드</div>
            {target?.fields.map(v => {
              return (
                <div>
                  <Input value={v.fieldName} />
                  <Select value={v.fieldType} options={options} />
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
