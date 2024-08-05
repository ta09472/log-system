import React, { useState } from "react";
import { Tabs, Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Workspace from "./Workspace";
import api from "../api";
import { useSearchParams } from "react-router-dom";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const WorkSpaceTab: React.FC = () => {
  const queryClient = useQueryClient();

  // 1. useQuery로 topicList를 가져온다.
  // 2. 1로 가져온 리스트를 탭의 요소들로 렌더링한다.
  // 3. useMutation으로 탭의 +버튼을 클릭시 새로운 post요청을 보내서 새로운 토픽을 생성한다.
  // 4. 이름을 변경 가능하다. 단 빈 문자열이나 중복된 이름은 허용되지 않는다.
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const items = data?.data
    .map(datum => {
      return {
        label: datum.topicName,
        key: datum.id.toString(),
        children: <Workspace topicName={datum.topicDescription} />,
      };
    })
    .sort((a, b) => Number(a.key) - Number(b.key));

  const { mutate: createTopic } = useMutation({
    mutationFn: api.topic.createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard"]);
    },
  });

  const { mutate: editTopic } = useMutation({
    mutationFn: api.topic.editTopic,
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard"]);
    },
  });

  const { mutate: deleteTopic } = useMutation({
    mutationFn: api.topic.deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard"]);
    },
  });

  const [name, setTabName] = useState("untitled");
  const [editableKey, setEditableKey] = useState<string | null>(null);

  const newTabIndex = items?.at(-1)?.key ?? 0 + 1;
  const workspace = searchParams.get("workspace") ?? undefined;

  const onChange = (newActiveKey: string) => {
    setSearchParams({ workspace: newActiveKey });
    // setActiveKey(newActiveKey);
  };

  const add = () => {
    createTopic({
      topicName: `${name}_${newTabIndex}`,
      topicDescription: "",
      // fields: [],
    });
  };

  const remove = (targetKey: TargetKey) => {
    deleteTopic({ id: Number(targetKey) });
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  const handleTabDoubleClick = (key: string) => {
    setEditableKey(key);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const newLabel = e.target.value;
    setTabName(newLabel);
  };

  const handleInputBlur = () => {
    setEditableKey(null);
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={workspace}
      onEdit={onEdit}
      items={items?.map(item => ({
        ...item,
        label:
          editableKey === item.key ? (
            <Input
              defaultValue={item.label}
              onChange={e => handleInputChange(e, item.key)}
              onBlur={handleInputBlur}
              autoFocus
            />
          ) : (
            <span onDoubleClick={() => handleTabDoubleClick(item.key)}>
              {item.label}
            </span>
          ),
      }))}
    />
  );
};

export default WorkSpaceTab;
