import Overview from "./Overview";
import Statistics from "./Statistics";
import TimeLine from "./TimeLine";

export default function Workspace() {
  return (
    <div className=" flex h-[49.5rem] gap-3  items-center justify-center">
      <div className=" flex flex-col basis-1/4 h-full">
        <Overview />
      </div>
      <div className=" flex flex-col basis-2/4 h-full">
        <Statistics />
      </div>
      <div className="basis-1/4 h-full">
        <TimeLine />
      </div>
    </div>
  );
}
