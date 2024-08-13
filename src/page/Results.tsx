import "../override.css";
import { useSearchParams } from "react-router-dom";
import AggregationResult from "../components/AggregationResult";
import RawResult from "../components/RawResult";

export default function Report() {
  const [searchParams] = useSearchParams();
  const searchType = searchParams.get("searchType") ?? "raw";

  if (searchType === "statics") return <AggregationResult />;

  return <RawResult />;
}
