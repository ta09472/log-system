import { useEffect, useState } from "react";
import { RawParams } from "../schema/raw";
import { LogAggregationParams } from "../schema/aggregation";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Divider, Input, message, Select, Switch } from "antd";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import api from "../api";
import { useQuery } from "react-query";

type AggForm = LogAggregationParams & { searchType: "raw" | "statics" };

interface Props {
  form: LogAggregationParams | undefined;
  setForm: React.Dispatch<React.SetStateAction<AggForm>>;
}

export default function AggregationForm({ form, setForm }: Props) {
  const [messageApi, contextHolder] = message.useMessage();

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const target = data?.data.find(
    ({ topicName }) => topicName === form?.topicName
  );

  const dataFiledOptions = target?.fields.map(({ fieldName }) => ({
    label: fieldName,
    value: fieldName,
  }));

  const isValid = form?.searchSettings.every(
    setting =>
      setting.settingName !== "" &&
      setting.conditionList.every(
        condition => condition.fieldName !== "" && condition.keyword !== ""
      )
  );

  return (
    <>
      {contextHolder}
      {form?.topicName && (
        <>
          <Divider />
          <div className="font-semibold text-lg">Search Condition</div>
          <div className=" flex items-center justify-between mt-3">
            <div className=" text-neutral-500">Schema</div>
            <Button
              type="text"
              onClick={() => {
                if (!isValid) {
                  messageApi.warning("Some data fields are incomplete!");
                  return;
                }
                setForm(prev => {
                  return {
                    ...prev,
                    searchSettings: [
                      ...prev.searchSettings,
                      {
                        settingName: "",
                        conditionList: [
                          { fieldName: "", keyword: "", equal: true },
                        ],
                      },
                    ],
                  };
                });
              }}
              className=" bg-neutral-100"
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
                    d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              }
            >
              Create a schema field
            </Button>
          </div>
          <div className="flex-col gap-2 flex py-1 overflow-scroll max-h-[13rem]">
            {form?.searchSettings?.map((v, index) => (
              <div className=" flex flex-col" key={index}>
                <div className=" flex items-center justify-between gap-[34rem]">
                  <Input
                    className=""
                    value={v.settingName}
                    variant="filled"
                    placeholder="Please enter the name of the setting."
                    onChange={({ currentTarget }) => {
                      const { value } = currentTarget;
                      setForm(prev => {
                        const updatedArray = prev.searchSettings?.map(
                          (item, id) =>
                            id === index
                              ? { ...item, settingName: value }
                              : item
                        );
                        return {
                          ...prev,
                          searchSettings: updatedArray,
                        };
                      });
                    }}
                  />

                  <Button
                    type="text"
                    danger
                    onClick={() => {
                      setForm(prev => {
                        return {
                          ...prev,
                          searchSettings: form.searchSettings.filter(
                            (t, i) => i !== index
                          ),
                        };
                      });
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
                <div className="text-neutral-500 flex items-center mt-4">
                  Keyword
                </div>
                <div className=" flex mt-4 gap-2 ">
                  <div className="text-neutral-500 basis-1/12 flex items-center">
                    #
                  </div>
                  <div className="text-neutral-500 basis-3/12 flex items-center">
                    Field Name
                  </div>
                  <div className="text-neutral-500 basis-5/12 flex items-center">
                    Keyword
                  </div>
                  <div className="text-neutral-500 basis-2/12 flex items-center">
                    Match Criteria
                  </div>
                  <div className="text-neutral-500 basis-1/12 text-end ">
                    <Button
                      type="text"
                      className=" bg-neutral-100"
                      onClick={() => {
                        if (isValid) {
                          const newForm = form.searchSettings.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    conditionList: [
                                      ...item.conditionList,
                                      {
                                        fieldName: "",
                                        keyword: "",
                                        equal: true,
                                      },
                                    ],
                                  }
                                : item
                          );

                          setForm(prev => {
                            return {
                              ...prev,
                              searchSettings: newForm,
                            } as AggForm;
                          });
                          return;
                        }

                        messageApi.warning("Some data fields are incomplete.");
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
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      }
                    >
                      Add Field
                    </Button>
                  </div>
                </div>
                {v?.conditionList?.map((val, condIndex) => (
                  <div className=" flex mt-4 gap-2 " key={condIndex}>
                    <div className="text-neutral-500 basis-1/12 flex items-center">
                      {condIndex + 1}
                    </div>
                    <div className="text-neutral-500 basis-3/12 flex items-center">
                      <Select
                        className=" w-full"
                        variant="filled"
                        options={dataFiledOptions}
                        value={val.fieldName}
                        onChange={option => {
                          const newForm = form.searchSettings.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    conditionList: item.conditionList.map(
                                      (cond, cIndex) =>
                                        cIndex === condIndex
                                          ? { ...cond, fieldName: option }
                                          : cond
                                    ),
                                  }
                                : item
                          );

                          setForm(prev => {
                            return {
                              ...prev,
                              searchSettings: newForm,
                            };
                          });
                        }}
                      />
                    </div>
                    <div className="text-neutral-500 basis-5/12 flex items-center">
                      <Input
                        variant="filled"
                        className=" w-full"
                        value={val.keyword}
                        placeholder="Enter the keyword you are looking for"
                        onChange={({ currentTarget }) => {
                          const { value } = currentTarget;

                          const newForm = form.searchSettings.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    conditionList: item.conditionList.map(
                                      (cond, cIndex) =>
                                        cIndex === condIndex
                                          ? { ...cond, keyword: value }
                                          : cond
                                    ),
                                  }
                                : item
                          );

                          setForm(prev => {
                            return {
                              ...prev,
                              searchSettings: newForm,
                            };
                          });
                        }}
                      />
                    </div>
                    <div className="text-neutral-500 basis-2/12 flex items-center">
                      <Switch
                        className=" w-full"
                        checked={val.equal}
                        checkedChildren="Exactly"
                        unCheckedChildren="Contains"
                        onChange={() => {
                          const newForm = form.searchSettings.map(
                            (item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    conditionList: item.conditionList.map(
                                      (cond, cIndex) =>
                                        cIndex === condIndex
                                          ? { ...cond, equal: !cond.equal }
                                          : cond
                                    ),
                                  }
                                : item
                          );

                          setForm(prev => {
                            return {
                              ...prev,
                              searchSettings: newForm,
                            } as AggForm;
                          });
                        }}
                      />
                    </div>
                    <div className="text-neutral-700 basis-1/12 text-end min-w-[7.5rem] ">
                      <Button
                        onClick={() => {
                          setForm(prev => {
                            return {
                              ...prev,
                              searchSettings: prev.searchSettings.map(
                                (setting, settingIndex) => {
                                  if (settingIndex === index) {
                                    // 특정 searchSettings 항목을 찾는 조건
                                    return {
                                      ...setting,
                                      conditionList:
                                        setting.conditionList.filter(
                                          (condition, conditionIndex) =>
                                            conditionIndex !== condIndex // 특정 condition을 제거하는 조건
                                        ),
                                    };
                                  }
                                  return setting; // 해당 항목이 아닐 경우 원래 항목을 유지
                                }
                              ),
                            };
                          });
                        }}
                        type="text"
                        className=" w-full"
                        // onClick={() => {
                        //   const newForm = form.searchSettings.map(
                        //     (item, itemIndex) =>
                        //       itemIndex === index
                        //         ? {
                        //             ...item,
                        //             conditionList:
                        //               item.conditionList.length === 1
                        //                 ? item.conditionList
                        //                 : item.conditionList.filter(
                        //                     (_, condIndex) =>
                        //                       condIndex !== condIndex
                        //                   ),
                        //           }
                        //         : item
                        //   );

                        //   setForm(prev => {
                        //     return {
                        //       ...prev,
                        //       searchSettings: newForm,
                        //     };
                        //   });
                        // }}
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
        </>
      )}
    </>
  );
}
