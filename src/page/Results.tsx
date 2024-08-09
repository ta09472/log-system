/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Skeleton, Table } from "antd";
import Layout from "../Layout/Layout";

import { RawParams } from "../schema/raw";
import { useEffect, useState } from "react";

import "../override.css";
import { useLocation, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import api from "../api";
import dayjs from "dayjs";

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
  // 서치타입에 따라서 url 바꿔서\

  useEffect(() => {
    setForm({
      topicName,
      from,
      to,
      condition,
      searchType: searchType as "raw" | "statics",
    });

    mutate({
      topicName: topicName,
      from: from,
      to: to,
      condition: condition,
      searchType: searchType as "raw" | "statics",
    });
  }, [search]);

  const transformedArray = data?.data.result.map(item => {
    const { data, ...rest } = item;
    return {
      ...rest,
      ...data,
    };
  });

  const dataSource = transformedArray?.map(v => {
    const date = dayjs(v.timestamp).format("YYYY-MM:DD HH:mm:ss");
    return {
      ...v,
      timestamp: date,
    };
  });

  const columns = Object.keys(transformedArray?.at(0) ?? {}).map(key => {
    return {
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key: key,
    };
  });

  return (
    <Layout>
      <Skeleton active loading={isLoading}>
        <div className=" font-bold text-2xl">
          검색결과가 {data?.data.result.length}개 있습니다.
        </div>
        <div>대충 검색 조건 보여주는 공간</div>
      </Skeleton>

      <Card loading={isLoading} bordered={false}>
        <Table loading={isLoading} columns={columns} dataSource={dataSource} />
      </Card>
    </Layout>
  );
}
