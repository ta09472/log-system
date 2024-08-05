import LogTable from "./LogTable";
import Overview from "./Overview";
import Statistics from "./Statistics";

interface Props {
  topicName: string;
}

export default function Workspace({ topicName }: Props) {
  return (
    <div className=" flex flex-col gap-2">
      <Overview />
      <Statistics />
      <LogTable />
    </div>
  );
}
