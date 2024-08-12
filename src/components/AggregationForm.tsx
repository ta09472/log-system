import { useEffect, useState } from "react";
import { RawParams } from "../schema/raw";
import { LogAggregationParams } from "../schema/aggregation";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button, DatePicker, Divider, Input, Select, Switch } from "antd";
import dayjs from "dayjs";
import disabled7DaysDate from "../util/dateRange";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

interface Props {
  form: RawParams;
}

const initialForm: LogAggregationParams = {
  topicName: "",
  from: 0,
  to: 0,
  searchSettings: [
    {
      settingName: "",
      conditionList: [{ fieldName: "", keyword: "", equal: true }],
    },
  ],
};

export default function AggregationForm({ form }: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const combinedForm = {
    topicName: form.topicName || initialForm.topicName,
    from: new Date(form.from || initialForm.from).getTime(),
    to: new Date(form.from || initialForm.from).getTime(),
    searchSettings: initialForm.searchSettings,
  };

  const [aggForm, setAggForm] = useState<LogAggregationParams>(combinedForm);

  useEffect(() => {
    if (pathname.includes("/results")) {
      const topicName = searchParams.get("topicName") ?? initialForm.topicName;
      const from = new Date(
        searchParams.get("start") ?? initialForm.from
      ).getTime();
      const to = new Date(searchParams.get("end") ?? initialForm.to).getTime();

      const condition =
        JSON.parse(searchParams.get("conditions") ?? "") ??
        initialForm.topicName;

      setAggForm({
        topicName,
        from,
        to,
        searchSettings: initialForm.searchSettings,
      });
    }
  }, [search]);

  return (
    <>
      {form.topicName && (
        <>
          <Divider />
          <div className="font-semibold text-lg">Search Condition</div>
          {/* <div className=" text-neutral-500">Date</div>
          <DatePicker.RangePicker
            value={[dayjs(form.from), dayjs(form.to)]}
            variant="filled"
            disabledDate={disabled7DaysDate}
            // onChange={c => onDateChange(c)}
          /> */}

          <div className=" flex items-center justify-between mt-3">
            <div className=" text-neutral-500">Schema</div>
            <Button
              type="text"
              onClick={() => {
                // if (isValid) {
                //   messageApi.warning("Some data fields are incomplete!");
                //   return;
                // }
                // onChange([...(form ?? []), initialForm]);
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
          <div className="flex-col gap-2 flex py-1 overflow-scroll max-h-[13rem]">
            {aggForm.searchSettings?.map((v, formId) => (
              <div className=" flex flex-col" key={v.id}>
                <div className=" flex items-center justify-between gap-[34rem]">
                  <Input
                    className=""
                    value={v.settingName}
                    // disabled={!!aggregationCondition?.data.at(formId)}
                    variant="filled"
                    // ref={ref}
                    placeholder="Please enter the name of the setting."
                    // onChange={({ currentTarget }) => {
                    //   const { value } = currentTarget;

                    //   const newForm = form.map(item =>
                    //     item.id === v.id
                    //       ? { ...item, settingName: value }
                    //       : item
                    //   );
                    //   onChange(newForm);
                    // }}
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
                              // onChange(form.filter(t => t.id !== v.id));
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
                      // disabled={!!aggregationCondition?.data.at(formId)}
                      // onClick={() => {
                      //   const isNotValid = form.every(t =>
                      //     t.condition.every(
                      //       o =>
                      //         o.fieldName.trim() !== "" &&
                      //         o.keyword.trim() !== ""
                      //     )
                      //   );

                      //   if (isNotValid) {
                      //     const newForm = form.map(
                      //       item =>
                      //         item.id === v.id // 특정 item을 찾는 조건
                      //           ? {
                      //               ...item,
                      //               condition: [
                      //                 ...item.condition,
                      //                 {
                      //                   fieldName: "",
                      //                   keyword: "",
                      //                   equal: true,
                      //                 },
                      //               ],
                      //             }
                      //           : item // id가 맞지 않는 경우 원래 item 유지
                      //     );

                      //     onChange(newForm as Aggregation[]); // 상태를 업데이트
                      //     return;
                      //   }
                      //   messageApi.warning("Some data fields are incomplete.");
                      // }}
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
                {v?.conditionList?.map((val, index) => (
                  <div className=" flex mt-4 gap-2 ">
                    <div className="text-neutral-500 basis-1/12 flex items-center">
                      {index + 1}
                    </div>
                    <div className="text-neutral-500 basis-3/12 flex items-center">
                      <Select
                        // disabled={
                        //   !!aggregationCondition?.data
                        //     .at(formId)
                        //     ?.condition.at(index)?.fieldName
                        // }
                        className=" w-full"
                        variant="filled"
                        // options={dataFiledOptions}
                        value={val.fieldName}
                        // onChange={option => {
                        //   const newForm = form.map(
                        //     item =>
                        //       item.id === v.id // 특정 item을 찾는 조건
                        //         ? {
                        //             ...item,
                        //             condition: item.condition.map(
                        //               (cond, condId) =>
                        //                 index === condId // 업데이트할 조건을 찾는 조건
                        //                   ? { ...cond, fieldName: option } // keyword 값을 업데이트
                        //                   : cond // 조건이 맞지 않는 경우 원래 객체 유지
                        //             ),
                        //           }
                        //         : item // id가 맞지 않는 경우 원래 item 유지
                        //   );

                        //   onChange(newForm as Aggregation[]); // 상태를 업데이트
                        // }}
                      />
                    </div>
                    <div className="text-neutral-500 basis-5/12 flex items-center">
                      <Input
                        // disabled={
                        //   !!aggregationCondition?.data
                        //     .at(formId)
                        //     ?.condition.at(index)?.keyword
                        // }
                        variant="filled"
                        className=" w-full"
                        value={val.keyword}
                        placeholder="Enter the keyword you are looking for"
                        // onChange={({ currentTarget }) => {
                        //   const { value } = currentTarget;

                        //   const newForm = form.map(
                        //     item =>
                        //       item.id === v.id // 특정 item을 찾는 조건
                        //         ? {
                        //             ...item,
                        //             condition: item.condition.map(
                        //               (cond, condId) =>
                        //                 index === condId // 업데이트할 조건을 찾는 조건
                        //                   ? { ...cond, keyword: value } // keyword 값을 업데이트
                        //                   : cond // 조건이 맞지 않는 경우 원래 객체 유지
                        //             ),
                        //           }
                        //         : item // id가 맞지 않는 경우 원래 item 유지
                        //   );

                        //   onChange(newForm as Aggregation[]); // 상태를 업데이트
                        // }}
                      />
                    </div>
                    <div className="text-neutral-500 basis-2/12 flex items-center">
                      <Switch
                        // disabled={!!aggregationCondition?.data.at(formId)}
                        className=" w-full"
                        value={val.equal}
                        checkedChildren="Exactly"
                        unCheckedChildren="Contains"
                        // onChange={() => {
                        //   const newForm = form.map(
                        //     item =>
                        //       item.id === v.id // 특정 item을 찾는 조건
                        //         ? {
                        //             ...item,
                        //             condition: item.condition.map(
                        //               (cond, condId) =>
                        //                 index === condId // 업데이트할 조건을 찾는 조건
                        //                   ? { ...cond, equal: !cond.equal } // keyword 값을 업데이트
                        //                   : cond // 조건이 맞지 않는 경우 원래 객체 유지
                        //             ),
                        //           }
                        //         : item // id가 맞지 않는 경우 원래 item 유지
                        //   );

                        //   onChange(newForm as Aggregation[]); // 상태를 업데이트
                        // }}
                      />
                    </div>
                    <div className="text-neutral-700 basis-1/12 text-end min-w-[7.5rem] ">
                      <Button
                        type="text"
                        className=" w-full"
                        // disabled={!!aggregationCondition?.data.at(formId)}
                        // onClick={() => {
                        //   const newForm = form.map(
                        //     item =>
                        //       item.id === v.id // 특정 item을 찾는 조건
                        //         ? {
                        //             ...item,
                        //             condition:
                        //               item.condition.length === 1
                        //                 ? item.condition // 배열에 요소가 하나만 있을 때는 삭제하지 않고 그대로 유지
                        //                 : item.condition.filter(
                        //                     (_, uid) => uid !== index
                        //                   ), // 그 외의 경우에는 필터링
                        //           }
                        //         : item // id가 맞지 않는 경우 원래 item 유지
                        //   );
                        //   onChange(newForm as Aggregation[]); // 상태를 업데이트
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
