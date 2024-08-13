/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Input,
  Radio,
  Select,
  Skeleton,
  Spin,
  Switch,
  Table,
} from "antd";
import Layout from "../Layout/Layout";

import { RawParams } from "../schema/raw";
import { Suspense, useEffect, useState } from "react";

import "../override.css";
import { useLocation, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import api from "../api";
import dayjs from "dayjs";
import PieChart from "../components/Pie";
import { LegendItem, LegendLabel, LegendOrdinal } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";
import { colorPallet } from "../components/Statistics";
import AggregationResult from "../components/AggregationResult";
import RawResult from "../components/RawResult";

export default function Report() {
  const [searchParams] = useSearchParams();
  const searchType = searchParams.get("searchType") ?? "raw";
  // const { mutate, isLoading, data } = useMutation(api.raw.getLogData);
  // const { search } = useLocation();

  // const topicName = searchParams.get("topicName") ?? initialForm.topicName;
  // const from = searchParams.get("start") ?? initialForm.from;
  // const to = searchParams.get("end") ?? initialForm.to;

  // const condition =
  //   JSON.parse(searchParams.get("conditions") ?? "") ?? initialForm.topicName;

  // // 이거 가지고 데이터 조회
  // // 서치타입에 따라서 url 바꿔서\

  // useEffect(() => {
  //   setForm({
  //     topicName,
  //     from,
  //     to,
  //     condition,
  //     searchType: searchType as "raw" | "statics",
  //   });

  //   mutate({
  //     topicName: topicName,
  //     from: from,
  //     to: to,
  //     condition: condition,
  //     searchType: searchType as "raw" | "statics",
  //   });
  // }, [search]);

  // const transformedArray = data?.data.result.map(item => {
  //   const { data, ...rest } = item;
  //   return {
  //     ...rest,
  //     ...data,
  //   };
  // });

  // const dataSource = transformedArray?.map(v => {
  //   const date = dayjs(v.timestamp).format("YYYY-MM:DD HH:mm:ss");
  //   return {
  //     ...v,
  //     timestamp: date,
  //   };
  // });

  // const columns = Object.keys(transformedArray?.at(0) ?? {}).map(key => {
  //   return {
  //     title: key.charAt(0).toUpperCase() + key.slice(1),
  //     dataIndex: key,
  //     key: key,
  //   };
  // });

  // const colorScale = scaleOrdinal({
  //   domain: dataSource?.map(v => v.topicName),
  //   range: colorPallet,
  // });

  if (searchType === "statics") return <AggregationResult />;

  return <RawResult />;

  {
    /* <Card bordered={false} className="basis-1/4">
          <div className=" text-xl font-bold">빈도수</div>
          <PieChart width={300} height={300} />

          <div className="">
            <div className=" mt-2">
              <LegendOrdinal
                scale={colorScale}
                labelFormat={label => `${label.toUpperCase()}`}
              >
                {labels => (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    {labels.map((label, i) => (
                      <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
                        <svg width={10} height={10}>
                          <rect fill={label.value} width={10} height={10} />
                        </svg>
                        <LegendLabel align="left" margin="0 0 0 4px">
                          {label.text}
                        </LegendLabel>
                      </LegendItem>
                    ))}
                  </div>
                )}
              </LegendOrdinal>
            </div>
            <Select variant="filled" value={"asd"} className="w-full mt-4" />
          </div>
        </Card> */
  }

  {
    /* <Card loading={isLoading} bordered={false} className="">
        <div className=" text-xl font-bold">검색 결과</div>
        <Table loading={isLoading} columns={columns} dataSource={dataSource} />
      </Card> */
  }
}

// <Card bordered={false}>
//   <div className="w-full rounded-md flex-col">
//     <div className="flex justify-between gap-4 w-full items-center pt-1">
//       <div className="flex items-center text-bold text-2xl">Filter</div>
//     </div>
//     <div className="p-3 flex-col">
//       {/* <SearchHistory onClose={onClose} /> */}
//       <div className="flex flex-col gap-2">
//         <div className="flex flex-col gap-2 ">
//           <div className="font-semibold text-lg">Topic</div>
//           <Select
//             variant="filled"
//             className=" w-full"
//             showSearch
//             value={form?.topicName}
//             placeholder="Select Topic"
//             optionFilterProp="label"
//             // onChange={onTopicChange}
//             // options={options}
//           />
//         </div>

//         <Divider />
//         <div className="font-semibold text-lg">Data Type</div>
//         <Radio.Group
//           defaultValue="raw"
//           value={form.searchType}
//           optionType="button"
//           buttonStyle="solid"
//           // onChange={v => onSearchTypeChange(v.target.value)}
//         >
//           <Radio.Button value="raw">Raw Data</Radio.Button>
//           <Radio.Button value="statics">Statics Data</Radio.Button>
//         </Radio.Group>

//         {form.topicName && (
//           <>
//             <Divider />
//             <div className="font-semibold text-lg">
//               Search Condition
//             </div>
//             <div className=" text-neutral-500">Date</div>
//             <DatePicker.RangePicker
//               value={[dayjs(form.from), dayjs(form.to)]}
//               variant="filled"
//               // disabledDate={disabled7DaysDate}
//               // onChange={c => onDateChange(c)}
//             />

//             <div className=" flex items-center justify-between text-neutral-500">
//               {form.condition?.length === 0 ? (
//                 <div className="line-through">Keyword</div>
//               ) : (
//                 "Keyword"
//               )}

//               <Button
//                 type="text"
//                 className="p-0 m-0"
//                 onClick={() => {
//                   // addCondition();
//                 }}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke-width="1.5"
//                   stroke="currentColor"
//                   className="size-5"
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                   />
//                 </svg>
//               </Button>
//             </div>
//             {form.condition?.length === 0 ? (
//               <div className="text-neutral-500  text-center">
//                 Search without specifying keywords.
//               </div>
//             ) : (
//               <div className=" flex">
//                 <div className="text-neutral-500 basis-1/12">#</div>
//                 <div className="text-neutral-500 basis-3/12 pl-[5.5px]">
//                   Data Field
//                 </div>
//                 <div className="text-neutral-500 basis-5/12  pl-[5.5px]">
//                   Keyword
//                 </div>
//                 <div className="text-neutral-500 basis-2/12  ">
//                   Match Criteria
//                 </div>
//               </div>
//             )}
//             <div className="flex-col gap-2 flex overflow-auto max-h-28 py-1">
//               {form?.condition?.map((v, id) => (
//                 <div className=" w-full flex gap-2 items-center">
//                   <div className="text-neutral-500 basis-1/12">
//                     {id + 1}
//                   </div>
//                   <Select
//                     variant="filled"
//                     className="basis-3/12"
//                     // options={dataFiledOptions}
//                     // onChange={v => onFieldChange(v, id)}
//                     value={v.fieldName}
//                   />
//                   <Input
//                     variant="filled"
//                     value={v.keyword}
//                     className="basis-5/12"
//                     placeholder="Enter the keyword you are looking for"
//                     // onChange={({ currentTarget }) =>
//                     //   onKeywordChange(currentTarget.value, id)
//                     // }
//                   />
//                   <Switch
//                     value={v.equal}
//                     className="basis-2/12"
//                     checkedChildren="Exactly"
//                     unCheckedChildren="Contains"
//                     defaultChecked
//                     // onChange={v => onCriteriaChange(v, id)}
//                   />
//                   <Button
//                     className="text-neutral-500 basis-1/12"
//                     type="text"
//                     key={`${v.fieldName}_${v.keyword}_${id}`}
//                     onClick={() => {
//                       // removeCondition(id);
//                     }}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke-width="1.5"
//                       stroke="currentColor"
//                       className="size-4"
//                     >
//                       <path
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                       />
//                     </svg>
//                   </Button>
//                 </div>
//               ))}
//             </div>
//             <Divider />
//           </>
//         )}
//         <div className=" flex gap-2 mt-2">
//           {/* <Button
//             block
//             type="text"
//             onClick={() => setForm(initialForm)}
//             className="basis-/2"
//           >
//             Clear
//           </Button> */}
//           <Button
//             loading={isLoading}
//             // disabled={isInvalid}
//             block
//             type="primary"
//             onClick={() => {
//               const url = `/results?topicName=${encodeURIComponent(form.topicName ?? "")}&searchType=${encodeURIComponent(form.searchType ?? "")}&start=${encodeURIComponent(form.from ?? "")}&end=${encodeURIComponent(form.to ?? "")}&conditions=${encodeURIComponent(JSON.stringify(form.condition))}`;
//               mutate(form);

//               // if (customLocalStorage.getItem("form")) {
//               //   // 검색기록이 이미 있다면 배열에 추가
//               //   customLocalStorage.addItem("form", form);
//               //   navigate(url);
//               //   onClose();
//               //   return;
//               // }
//               // // 검색기록이 없다면 새로만들기

//               // customLocalStorage.createItem("form", form);
//               // navigate(url);
//               // onClose();
//             }}
//             className="basis-/2"
//           >
//             Search
//           </Button>
//         </div>
//       </div>
//     </div>
//   </div>
// </Card>
