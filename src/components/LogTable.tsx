import { Divider, Modal, Popover } from "antd";
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

  const [current] = useState(dayjs(new Date()).format(" MMMM DD, HH:mm:ss"));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState();

  const { data: topic } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const target = topic?.data.find(datum => datum.id.toString() === workspaceId);

  const { message: raw } = useWebSocket({
    topicName: target?.topicName ?? "",
    searchType: "raw",
  });

  // const { message: agg } = useWebSocket({
  //   topicName: target?.topicName ?? "",
  //   searchType: "agg",
  // });

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
  }, [location.search]);

  return (
    <div className="flex flex-col gap-1">
      <div className=" flex items-center gap-1 text-2xl font-bold">
        <div>{target?.topicName}</div>
        <Popover
          content={
            <div className=" text-xs text-neutral-500">
              Only up to 100 data entries are displayed from the shown time.
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
      <div className=" text-neutral-500">
        Displays data starting from {dayjs(current).format(" MMMM DD")} at{" "}
        {dayjs(current).format("HH:mm:ss")}
      </div>
      <div className="h-[41rem] overflow-auto flex flex-col gap-1">
        {messages.length === 0 ? (
          <div className=" h-full flex items-center justify-center font-semibold text-lg text-neutral-600">
            No Data
          </div>
        ) : (
          messages.map(v => {
            return (
              <>
                <div
                  className="flex flex-col rounded-md cursor-pointer "
                  key={JSON.stringify(v)}
                  onClick={() => {
                    setDetail(v);
                    setOpen(true);
                  }}
                >
                  {Object.entries(v ?? {})
                    .slice(0, 4)
                    .map(([key, value]) => {
                      return (
                        <div className="flex flex-col gap-2" key={key}>
                          {key === "timestamp" ? (
                            <div className="text-neutral-500 pt-2 self-end">
                              {dayjs(value as string).format(
                                "MMMM DD, YYYY [at] h:mm:ss A"
                              )}
                            </div>
                          ) : (
                            <div>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                              {value as string}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
                <Divider className=" my-2 p-0" />
              </>
            );
          })
        )}
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        centered
        footer={null}
        title={<div className=" text-2xl">Log Detail</div>}
      >
        {Object.entries(detail ?? {}).map(([key, value]) => {
          return (
            <div className="flex flex-col gap-2" key={key}>
              {key === "timestamp" ? (
                <div className="text-neutral-500 pt-2 self-end">
                  {dayjs(value as string).format(
                    "MMMM DD, YYYY [at] h:mm:ss A"
                  )}
                </div>
              ) : (
                <div>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                  {value as string}
                </div>
              )}
            </div>
          );
        })}
      </Modal>
    </div>
  );
}
