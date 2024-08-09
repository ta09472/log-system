import { Card, Divider, Table } from "antd";
import useWebSocket from "../hook/useWebSocket";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import api from "../api";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function LogTable() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const [messages, setMessages] = useState<unknown[]>([]);

  const { data: topic } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const target = topic?.data.find(datum => datum.id.toString() === workspaceId);

  const { message: raw } = useWebSocket({
    topicName: target?.topicName ?? "",
    searchType: "raw",
  });

  const { message: agg } = useWebSocket({
    topicName: target?.topicName ?? "",
    searchType: "agg",
  });

  useEffect(() => {
    if (!raw.data) return;
    // 데이터 최대 갯수를 정하자
    setMessages([
      {
        ...raw.data,
        timestamp: dayjs(raw.timestamp).format("YYYY-MM-DD HH:mm:ss"),
      },
      ...messages.slice(0, 99),
    ]);

    return () => {
      setMessages([]);
    };
  }, [raw]);

  useEffect(() => {
    // URL 파라미터가 변경될 때 messages 초기화
    setMessages([]);
  }, [location.search]); // location.search는 URL의 쿼리 파라미터를 나타냄

  // const { data, ...rest } = raw;

  // const transformedObject = {
  //   ...rest, // 나머지 속성들 복사
  //   ...data, // 'data' 객체의 속성들 병합
  // };

  // const transformedArray = raw?.data?.map(item => {
  //   const { data, ...rest } = item;
  //   return {
  //     ...rest,
  //     ...data,
  //   };
  // });
  // const columns = Object.keys(transformedObject ?? {}).map(key => {
  //   return {
  //     title: key.charAt(0).toUpperCase() + key.slice(1),
  //     dataIndex: key,
  //     key: key,
  //   };
  // });

  return (
    <div className="flex flex-col gap-3">
      <div className=" font-bold text-lg">{target?.topicName}</div>
      <div className="h-[44rem] overflow-auto flex flex-col gap-1">
        {messages.map(v => {
          return (
            <div
              className="flex flex-col gap-1rounded-md p-4"
              key={JSON.stringify(v)}
            >
              {Object.entries(v ?? {}).map(([key, value]) => {
                return (
                  <div>
                    {key}: {value}
                  </div>
                );
              })}
              <Divider />
            </div>
          );
        })}
      </div>
      {/* <Table
        size="small"
        scroll={{ y: "20rem" }}
        columns={columns}
        dataSource={messages}
        className=" max-h-[30rem] overflow-scroll"
        pagination={false}
      /> */}
    </div>
  );
}
