import { Card, Table } from "antd";
import Layout from "../Layout/Layout";
import { useMutation } from "react-query";
import api from "../api";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { RawParams } from "../schema/raw";

const initialForm: RawParams = {
  topicName: undefined,
  searchType: "raw",
  from: dayjs().subtract(1, "day").toISOString(),
  to: dayjs().toISOString(),
  condition: [{ fieldName: "", keyword: "", equal: true }],
};

export default function RawResult() {
  const [searchParams] = useSearchParams();
  const { search } = useLocation();

  const topicName = searchParams.get("topicName") ?? initialForm.topicName;
  const from = searchParams.get("start") ?? initialForm.from;
  const to = searchParams.get("end") ?? initialForm.to;
  const searchType = searchParams.get("searchType") ?? initialForm.searchType;
  const condition =
    JSON.parse(searchParams.get("conditions") ?? "") ?? initialForm.topicName;

  const { mutate, isLoading, data } = useMutation(api.raw.getLogData);

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

  useEffect(() => {
    mutate({
      topicName: topicName,
      from: from,
      to: to,
      condition: condition,
      searchType: searchType as "raw" | "statics",
    });
  }, [search]);

  return (
    <Layout>
      <div className=" text-xl font-bold">Raw 검색 결과</div>
      <Card bordered={false} className="">
        <Table loading={isLoading} columns={columns} dataSource={dataSource} />
      </Card>
    </Layout>
  );
}
