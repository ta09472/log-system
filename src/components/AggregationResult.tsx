import { Card } from "antd";
import { useMutation } from "react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../api";

import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { LogAggregationParams } from "../schema/aggregation";

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

export default function AggregationResult() {
  const [searchParams] = useSearchParams();
  const { mutate } = useMutation(api.aggregation.getAggregationData);
  const { search } = useLocation();

  const topicName = searchParams.get("topicName") ?? initialForm.topicName;
  const from = searchParams.get("start") ?? initialForm.from;
  const to = searchParams.get("end") ?? initialForm.to;
  //   const searchType = searchParams.get("searchType") ?? "statics";
  //   const condition =
  //     JSON.parse(searchParams.get("conditions") ?? "") ?? initialForm.topicName;

  const [form, setForm] = useState<LogAggregationParams>({
    topicName,
    from: new Date(from).getTime(),
    to: new Date(to).getTime(),
    searchSettings: initialForm.searchSettings,
  });

  useEffect(() => {
    setForm({
      topicName,
      from: new Date(from).getTime(),
      to: new Date(to).getTime(),
      searchSettings: initialForm.searchSettings,
    });

    mutate({
      topicName: topicName ?? "",
      from: new Date(from ?? "").getTime(),
      to: new Date(to ?? "").getTime(),
      searchSettings: initialForm.searchSettings,
    });
  }, [search]);

  console.log(form);
  return (
    <Layout>
      <Card bordered={false} className="">
        <div className=" text-xl font-bold">검색 결과</div>
      </Card>
    </Layout>
  );
}
