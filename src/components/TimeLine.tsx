import { Card } from "antd";
import LogTable from "./LogTable";

export default function TimeLine() {
  return (
    <Card bordered={false} className=" h-full">
      <LogTable />
    </Card>
  );
}
