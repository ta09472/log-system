import { Card } from "antd";
import LogTable from "./LogTable";

export default function Test() {
  return (
    <Card bordered={false} className=" h-full">
      <LogTable />
    </Card>
  );
  return (
    <div className=" flex  gap-3 basis-1/4">
      {/* <Card bordered={false} className=" basis-2/3" /> */}
      <Card bordered={false} className=" "></Card>
    </div>
  );
}
