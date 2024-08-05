import { Button, Card } from "antd";
import "../override.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Card bordered={false}>
      <div className=" flex">
        <div className=" flex gap-2 basis-1/2">
          <Button
            type="text"
            size="large"
            className={pathname === "/" ? "text-black" : "text-neutral-400"}
            onClick={() => navigate("/")}
          >
            Dashboard
          </Button>

          <Button
            type="text"
            size="large"
            className={
              pathname === "/report" ? "text-black" : "text-neutral-400"
            }
            onClick={() => navigate("/report")}
          >
            Report
          </Button>
          <Button
            type="text"
            size="large"
            className={
              pathname === "/history" ? "text-black" : "text-neutral-400"
            }
            onClick={() => navigate("/history")}
          >
            History
          </Button>
        </div>
        <div className="  flex items-center basis-1/2">
          <Button
            id="search"
            block
            className=" bg-neutral-100 text-[#c5c5c5] hover:text-red  flex justify-start"
            size="large"
            type="text"
            style={{}}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="#c5c5c5"
                className="size-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            }
            iconPosition="start"
          >
            검색
          </Button>
        </div>
      </div>
    </Card>
  );
}
