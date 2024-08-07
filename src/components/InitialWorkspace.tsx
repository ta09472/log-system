import { Button, Card } from "antd";
import WorkspaceEditModal from "./WorkspaceEditModal";
import { useState } from "react";

export default function InitialWorkSpace() {
  const [open, setOpen] = useState(false);

  return (
    <Card
      className=" flex flex-col h-[49.5rem]  items-center justify-center "
      bordered={false}
    >
      <Button size="large" type="primary" onClick={() => setOpen(true)}>
        토픽 수정
      </Button>

      <WorkspaceEditModal open={open} onClose={() => setOpen(false)} />
    </Card>
  );
}
