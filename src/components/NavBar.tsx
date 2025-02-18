import { Button, Card, Dropdown, MenuProps } from "antd";
import "../override.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import DropdownContent from "./DropdownContent";
import { useQuery } from "react-query";
import api from "../api";

const items: MenuProps["items"] = [];

const menuProps = {
  items,
};

export default function NavBar() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const homeId = data?.data.at(0)?.id;
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const handleDropdownClick = () => {
    setOpen(true);
    // 포커스 맞추기
  };

  return (
    <Card bordered={false}>
      <div className="flex">
        <div className="flex gap-2 basis-1/2">
          <Button
            type="text"
            size="large"
            className={pathname === "/" ? "text-black" : "text-neutral-400"}
            onClick={() => navigate(`/?workspace=${homeId}`)}
          >
            Dashboard
          </Button>

          {/* <Button
            type="text"
            size="large"
            className={
              pathname === "/setting" ? "text-black" : "text-neutral-400"
            }
            onClick={() => navigate("/setting")}
          >
            Setting
          </Button> */}
        </div>

        <div className="flex items-center basis-1/2">
          <Dropdown
            menu={menuProps}
            trigger={["click"]}
            open={open}
            onOpenChange={() => setOpen(false)}
            overlayClassName="bg-white rounded"
            dropdownRender={() => (
              <DropdownContent onClose={() => setOpen(false)} />
            )}
          >
            <Button
              id="search"
              block
              className="bg-neutral-100 text-[#c5c5c5] hover:text-red flex justify-start "
              size="large"
              type="text"
              onClick={handleDropdownClick}
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
              Search Here
            </Button>
          </Dropdown>
        </div>
      </div>
    </Card>
  );
}
