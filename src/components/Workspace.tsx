import { Suspense } from "react";
import Overview from "./Overview";
import Statistics from "./Statistics";
import TimeLine from "./TimeLine";
import { Spin } from "antd";

export default function Workspace() {
  return (
    <div className=" flex h-[49.5rem] gap-3  items-center justify-center">
      <div className=" flex flex-col basis-1/5 h-full">
        <Suspense fallback={<Spin />}>
          <Overview />
        </Suspense>
      </div>
      <div className=" flex flex-col basis-3/5 h-full">
        <Suspense fallback={<Spin />}>
          <Statistics />
        </Suspense>
      </div>
      <div className="basis-1/5 h-full">
        <Suspense fallback={<Spin />}>
          <TimeLine />
        </Suspense>
      </div>
    </div>
  );
}
