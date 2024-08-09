import { Button, Spin, Table } from "antd";
import Layout from "../Layout/Layout";

import { RawParams } from "../schema/raw";
import { useEffect, useState } from "react";

import "../override.css";
import { useLocation, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import api from "../api";

const initialForm: RawParams = {
  topicName: undefined,
  searchType: "raw",
  from: undefined,
  to: undefined,
  condition: [{ fieldName: "", keyword: "", equal: true }],
};

export default function Report() {
  const [searchParams] = useSearchParams();
  const { mutate, isLoading, data } = useMutation(api.raw.getLogData);
  const { search } = useLocation();

  const topicName = searchParams.get("topicName") ?? initialForm.topicName;
  const from = searchParams.get("start") ?? initialForm.from;
  const to = searchParams.get("end") ?? initialForm.to;
  const searchType = searchParams.get("searchType") ?? initialForm.searchType;
  const condition =
    JSON.parse(searchParams.get("conditions") ?? "") ?? initialForm.topicName;

  const [form, setForm] = useState<RawParams>({
    topicName,
    from,
    to,
    condition,
    searchType: searchType as "raw" | "statics",
  });

  // 이거 가지고 데이터 조회
  // 서치타입에 따라서 url 바꿔서

  useEffect(() => {
    // setForm({
    //   topicName,
    //   from,
    //   to,
    //   condition,
    //   searchType: searchType as "raw" | "statics",
    // });

    mutate({
      topicName: form.topicName,
      from: form.from,
      to: form.to,
      condition: form.condition,
      searchType: form.searchType,
    });
    console.log("render");
    console.log(searchType);
    console.log(form);
  }, [search]);

  return (
    <Layout>
      {JSON.stringify(data?.data)}
      {JSON.stringify(form)}

      <Table />
    </Layout>
  );
}
