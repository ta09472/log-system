import { Card } from "antd";
import { useMutation } from "react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../api";

import { useEffect } from "react";
import Layout from "../Layout/Layout";
import { LogAggregationParams } from "../schema/aggregation";
import dayjs from "dayjs";

type AggForm = LogAggregationParams & { searchType: "raw" | "statics" };

const initialForm: AggForm = {
  topicName: "",
  searchType: "statics",
  from: dayjs().subtract(1, "day").toISOString(),
  to: dayjs().toISOString(),
  searchSettings: [
    {
      settingName: "",
      conditionList: [{ fieldName: "", keyword: "", equal: true }],
    },
  ],
};

export default function AggregationResult() {
  const [searchParams] = useSearchParams();
  const { search } = useLocation();

  const topicName = searchParams.get("topicName") ?? initialForm.topicName;
  const from = searchParams.get("start") ?? initialForm.from;
  const to = searchParams.get("end") ?? initialForm.to;
  const searchSettings =
    JSON.parse(searchParams.get("aggConditions") ?? "") ??
    initialForm.searchSettings;

  const { mutate, isLoading, data } = useMutation(
    api.aggregation.getAggregationData
  );

  useEffect(() => {
    mutate({
      topicName,
      from,
      to,
      searchSettings,
    });
  }, [search]);

  console.log(data);

  return (
    <Layout>
      <Card bordered={false} className="" loading={isLoading}>
        <div className=" text-xl font-bold">AGG 검색 결과</div>
      </Card>
    </Layout>
  );
}
