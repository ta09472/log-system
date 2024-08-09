/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Divider, Popover } from "antd";
import customLocalStorage from "../util/localstorage";
import { RawParams } from "../schema/raw";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

type Item = RawParams & { id: number };
export default function SearchHistory({ onClose }: Props) {
  const items: Item[] = customLocalStorage.getItem("form");

  const [_, setTmp] = useState(items);
  const navigate = useNavigate();

  const deleteItem = (id: number) => {
    customLocalStorage.removeItem("form", id);
  };

  if (!items) return null;
  if (items.length === 0) return null;

  return (
    <>
      <div className="font-semibold text-lg">Recent</div>
      <div className="flex gap-2 items-center overflow-auto max-w-[33rem] min-h-[6rem]">
        {items.toReversed()?.map(v => (
          <div className=" flex-col flex" key={v.id}>
            <Popover
              getPopupContainer={triggerNode =>
                triggerNode.parentNode as HTMLElement
              }
              key={v.id}
              placement="topLeft"
              arrow={false}
              content={
                <div>
                  {v.condition?.map((v, id) => (
                    <div className="flex items-center gap-1" key={id}>
                      <div>Data Field: {v.fieldName}</div>
                      <div>Keyword: {v.keyword}</div>
                      <div>{v.equal === true ? "true" : "false"}</div>
                    </div>
                  ))}
                </div>
              }
              title="Search Condition"
            >
              <Button
                type="text"
                className="bg-neutral-100 flex-col flex justify-center gap-1 pt-[2.24rem] pb-10 px-0"
                onClick={() => {
                  const url = `/results?topicName=${encodeURIComponent(v.topicName ?? "")}&searchType=${encodeURIComponent(v.searchType ?? "")}&start=${encodeURIComponent(v.from ?? "")}&end=${encodeURIComponent(v.to ?? "")}&conditions=${encodeURIComponent(JSON.stringify(v.condition))}`;
                  navigate(url);
                  onClose();
                }}
              >
                <Button
                  type="text"
                  size="small"
                  className=" self-end  px-0"
                  onClick={() => {
                    // 객체가 아니라 id로 찾아서 제거해야됨
                    deleteItem(v.id);
                    setTmp(items);
                  }}
                >
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
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </Button>
                <div className=" px-4">
                  <div className=" text-neutral-600">{v.topicName}</div>
                  <div className=" text-neutral-600">
                    {`${dayjs(v.from).format("MM-DD")} ~ ${dayjs(v.to).format("MM-DD")}`}
                  </div>
                </div>
              </Button>
            </Popover>
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
}
