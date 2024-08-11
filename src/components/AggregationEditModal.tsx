import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  Button,
  Divider,
  Input,
  InputRef,
  message,
  Modal,
  Select,
  Switch,
} from "antd";
import { Aggregation } from "../schema/aggregation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../api";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";

interface Props {
  form: Aggregation[] | undefined;
  open: boolean;
  onClose: () => void;
  onChange: (v: Aggregation[]) => void;
}

export default function AggregationEditModal({
  open,
  onClose,
  form,
  onChange,
}: Props) {
  const queryClient = useQueryClient();
  const ref = useRef<InputRef>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const { data: topics } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const target = topics?.data.find(
    datum => datum.id.toString() === workspaceId
  );

  const { mutateAsync } = useMutation(api.aggregation.deleteSetting, {
    onSuccess: () => {
      queryClient.invalidateQueries(["aggCondition", target?.topicName]);
      messageApi.success("Changes have been successfully saved.");
    },
  });

  const { mutateAsync: createCondition } = useMutation(
    api.aggregation.createCondition,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["aggCondition", target?.topicName]);
        messageApi.success("Changes have been successfully saved.");
      },
    }
  );

  const { data: aggregationCondition } = useQuery({
    queryKey: ["aggCondition", target?.topicName],
    queryFn: () => api.aggregation.getCondition(target?.topicName ?? ""),
    refetchOnWindowFocus: false,
    // enabled: !!topics,
  });

  const dataFiledOptions = target?.fields.map(({ fieldName }) => ({
    label: fieldName,
    value: fieldName,
  }));

  const isValid = !(
    form?.every(g => g.settingName.trim() !== "") &&
    form?.every(v =>
      v.condition?.every(
        d => d.fieldName.trim() !== "" && d.keyword.trim() !== ""
      )
    )
  );

  const initialForm: Aggregation = {
    id: (aggregationCondition?.data.at(-1)?.id ?? 0) + 1,
    topicName: target?.topicName ?? "",
    settingName: "",
    condition: [
      {
        fieldName: "",
        keyword: "",
        equal: true,
      },
    ],
  };

  return (
    <>
      {contextHolder}
      <Modal
        width={"40rem"}
        open={open}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        okButtonProps={{
          className: "bg-black hover:opacity-75",
          disabled:
            JSON.stringify(aggregationCondition?.data ?? {}) ===
              JSON.stringify(form) || isValid,
        }}
        onCancel={() => {
          if (
            JSON.stringify(aggregationCondition?.data ?? {}) !==
            JSON.stringify(form)
          ) {
            messageApi.warning("Changes have not been saved.");
            return;
          }
          if (!aggregationCondition?.data) {
            // console.log(aggregationCondition?.data);
            // console.log(form);
            // onChange(aggregationCondition?.data);
          }

          onClose();
        }}
        onOk={() => {
          // 클라이언트 상태랑 서버상태랑 비교해서 클라이언트 상태에서 없는 id 찾아서 mutateAsync 실행

          const removeTarget = aggregationCondition?.data
            ?.filter(item => !new Set(form?.map(item => item.id)).has(item.id))
            .map(y => y.id);

          removeTarget?.forEach(a => {
            mutateAsync(a);
          });

          const createTarget = form?.filter(
            item =>
              !new Set(aggregationCondition?.data?.map(item => item.id)).has(
                item.id
              )
          );

          createTarget?.forEach(a => {
            createCondition(a);
          });

          // 세팅 생성

          onClose();
        }}
        okText="Save"
        centered
        title={
          <div className=" font-bold text-2xl flex items-center justify-center mt-4">
            Aggregation Setting
          </div>
        }
      >
        <div className=" flex flex-col gap-2">
          <div className=" flex justify-between mt-8">
            <div className=" font-semibold text-xl">Manage Schema</div>

            <Button
              type="text"
              onClick={() => {
                if (isValid) {
                  messageApi.warning("Some data fields are incomplete!");
                  return;
                }
                onChange([...(form ?? []), initialForm]);
                ref.current?.focus();
              }}
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
              Create a schema field
            </Button>
          </div>
          <div className=" text-neutral-500">
            어쩌구 저쩌구 이런 저런 일을 할 수 있습니다.
          </div>
          <Divider />
          <div className="flex-col gap-2 flex py-1 overflow-scroll max-h-[40rem]">
            {form?.map((v, formId) => (
              <div className=" flex flex-col" key={v.id}>
                <div className=" flex items-center justify-between gap-[18rem]">
                  <Input
                    className=""
                    value={v.settingName}
                    disabled={!!aggregationCondition?.data.at(formId)}
                    variant="filled"
                    ref={ref}
                    placeholder="Please enter the name of the setting."
                    onChange={({ currentTarget }) => {
                      const { value } = currentTarget;

                      const newForm = form.map(item =>
                        item.id === v.id
                          ? { ...item, settingName: value }
                          : item
                      );
                      onChange(newForm);
                    }}
                  />

                  <Popover className="relative ">
                    {({ open }) => (
                      <>
                        <PopoverButton className="">
                          <div
                            className={`border rounded-md ${
                              open ? "border-neutral-600" : "border-transparent"
                            }`}
                            id="target"
                          >
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
                        </PopoverButton>

                        <PopoverPanel
                          anchor="bottom start"
                          className="flex flex-col bg-white shadow-lg p-2 gap-2 rounded-md"
                          style={{ zIndex: 10000000000 }}
                        >
                          {/* PUT 메소드 생기면 Edit 버튼 기능 활성화 */}
                          <Button
                            // disabled={!!aggregationCondition?.data.at(formId)}
                            disabled
                            size="small"
                            type="text"
                            className="flex justify-start"
                            icon={
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
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            danger
                            type="text"
                            size="small"
                            onClick={() => {
                              onChange(form.filter(t => t.id !== v.id));
                            }}
                            icon={
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
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            }
                          >
                            Delete
                          </Button>
                        </PopoverPanel>
                      </>
                    )}
                  </Popover>
                </div>
                <div className=" flex mt-4 gap-2">
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
                      disabled={!!aggregationCondition?.data.at(formId)}
                      onClick={() => {
                        const isNotValid = form.every(t =>
                          t.condition.every(
                            o =>
                              o.fieldName.trim() !== "" &&
                              o.keyword.trim() !== ""
                          )
                        );

                        if (isNotValid) {
                          const newForm = form.map(
                            item =>
                              item.id === v.id // 특정 item을 찾는 조건
                                ? {
                                    ...item,
                                    condition: [
                                      ...item.condition,
                                      {
                                        fieldName: "",
                                        keyword: "",
                                        equal: true,
                                      },
                                    ],
                                  }
                                : item // id가 맞지 않는 경우 원래 item 유지
                          );

                          onChange(newForm as Aggregation[]); // 상태를 업데이트
                          return;
                        }
                        messageApi.warning("Some data fields are incomplete.");
                      }}
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
                      Add Field
                    </Button>
                  </div>
                </div>
                {v?.condition?.map((val, index) => (
                  <div className=" flex mt-4 gap-2">
                    <div className="text-neutral-500 basis-4/12 flex items-center">
                      <Select
                        disabled={
                          !!aggregationCondition?.data
                            .at(formId)
                            ?.condition.at(index)?.fieldName
                        }
                        className=" w-full"
                        variant="filled"
                        options={dataFiledOptions}
                        value={val.fieldName}
                        onChange={option => {
                          const newForm = form.map(
                            item =>
                              item.id === v.id // 특정 item을 찾는 조건
                                ? {
                                    ...item,
                                    condition: item.condition.map(
                                      (cond, condId) =>
                                        index === condId // 업데이트할 조건을 찾는 조건
                                          ? { ...cond, fieldName: option } // keyword 값을 업데이트
                                          : cond // 조건이 맞지 않는 경우 원래 객체 유지
                                    ),
                                  }
                                : item // id가 맞지 않는 경우 원래 item 유지
                          );

                          onChange(newForm as Aggregation[]); // 상태를 업데이트
                        }}
                      />
                    </div>
                    <div className="text-neutral-500 basis-4/12 flex items-center">
                      <Input
                        disabled={
                          !!aggregationCondition?.data
                            .at(formId)
                            ?.condition.at(index)?.keyword
                        }
                        variant="filled"
                        className=" w-full"
                        value={val.keyword}
                        placeholder="Enter the keyword you are looking for"
                        onChange={({ currentTarget }) => {
                          const { value } = currentTarget;

                          const newForm = form.map(
                            item =>
                              item.id === v.id // 특정 item을 찾는 조건
                                ? {
                                    ...item,
                                    condition: item.condition.map(
                                      (cond, condId) =>
                                        index === condId // 업데이트할 조건을 찾는 조건
                                          ? { ...cond, keyword: value } // keyword 값을 업데이트
                                          : cond // 조건이 맞지 않는 경우 원래 객체 유지
                                    ),
                                  }
                                : item // id가 맞지 않는 경우 원래 item 유지
                          );

                          onChange(newForm as Aggregation[]); // 상태를 업데이트
                        }}
                      />
                    </div>
                    <div className="text-neutral-500 basis-4/12 flex items-center">
                      <Switch
                        disabled={!!aggregationCondition?.data.at(formId)}
                        value={val.equal}
                        checkedChildren="Exactly"
                        unCheckedChildren="Contains"
                        onChange={() => {
                          const newForm = form.map(
                            item =>
                              item.id === v.id // 특정 item을 찾는 조건
                                ? {
                                    ...item,
                                    condition: item.condition.map(
                                      (cond, condId) =>
                                        index === condId // 업데이트할 조건을 찾는 조건
                                          ? { ...cond, equal: !cond.equal } // keyword 값을 업데이트
                                          : cond // 조건이 맞지 않는 경우 원래 객체 유지
                                    ),
                                  }
                                : item // id가 맞지 않는 경우 원래 item 유지
                          );

                          onChange(newForm as Aggregation[]); // 상태를 업데이트
                        }}
                      />
                    </div>
                    <div className="text-neutral-700 basis-2/12 text-end min-w-[7.5rem] ">
                      <Button
                        type="text"
                        className=" w-full"
                        disabled={!!aggregationCondition?.data.at(formId)}
                        onClick={() => {
                          const newForm = form.map(
                            item =>
                              item.id === v.id // 특정 item을 찾는 조건
                                ? {
                                    ...item,
                                    condition:
                                      item.condition.length === 1
                                        ? item.condition // 배열에 요소가 하나만 있을 때는 삭제하지 않고 그대로 유지
                                        : item.condition.filter(
                                            (_, uid) => uid !== index
                                          ), // 그 외의 경우에는 필터링
                                  }
                                : item // id가 맞지 않는 경우 원래 item 유지
                          );
                          onChange(newForm as Aggregation[]); // 상태를 업데이트
                        }}
                        icon={
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
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        }
                      />
                    </div>
                  </div>
                ))}
                <Divider />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
