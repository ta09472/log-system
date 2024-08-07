import LogTable from "./LogTable";
import Overview from "./Overview";
import Statistics from "./Statistics";

export default function Workspace() {
  return (
    <div className=" flex flex-col gap-2">
      <Overview />
      <Statistics />
      <LogTable />
    </div>
  );
}
