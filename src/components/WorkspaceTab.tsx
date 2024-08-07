import React from "react";
import { Tabs, Spin } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Workspace from "./Workspace";
import api from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import InitialWorkSpace from "./InitialWorkspace";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const WorkSpaceTab: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const workspace = searchParams.get("workspace") ?? undefined;
  // 1. useQuery로 topicList를 가져온다.
  // 2. 1로 가져온 리스트를 탭의 요소들로 렌더링한다.
  // 3. useMutation으로 탭의 +버튼을 클릭시 새로운 post요청을 보내서 새로운 토픽을 생성한다.
  // 4. 이름을 변경 가능하다. 단 빈 문자열이나 중복된 이름은 허용되지 않는다.

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const items = data?.data
    .map(datum => {
      return {
        label: datum.topicName,
        key: datum.id.toString(),
        children: !datum.fields.length ? <InitialWorkSpace /> : <Workspace />,
      };
    })
    .sort((a, b) => Number(a.key) - Number(b.key));

  const {
    mutate: createTopic,
    data: createdTopicId,
    isLoading: createTopicLoading,
  } = useMutation({
    mutationFn: api.topic.createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard"]);
      const newTabIndex =
        items?.at(-1)?.key === undefined ? 0 : Number(items?.at(-1)!.key) + 1;
      if (createdTopicId?.status === 200) navigate(`?workspace=${newTabIndex}`);
    },
  });

  const {
    mutate: deleteTopic,
    isLoading: deleteTopicLoading,
    data: deletedTopic,
  } = useMutation({
    mutationFn: api.topic.deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard"]);
      const newTabIndex =
        items?.at(0)?.key === undefined ? 0 : Number(items?.at(0)!.key);
      if (deletedTopic?.status === 200) {
        navigate(`?workspace=${newTabIndex}`);
      }
    },
  });

  const onChange = (newActiveKey: string) => {
    setSearchParams({ workspace: newActiveKey });
  };

  const add = () => {
    const newTabIndex =
      items?.at(-1)?.key === undefined ? 0 : Number(items?.at(-1)!.key) + 1;

    createTopic({
      topicName: `Topic_${newTabIndex}`,
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

  return (
    <div style={{ position: "relative" }}>
      {(createTopicLoading || deleteTopicLoading) && <Spin fullscreen />}
      <Tabs
        type="editable-card"
        animated={{
          inkBar: true,
          tabPane: true,
        }}
        onChange={onChange}
        activeKey={workspace}
        onEdit={onEdit}
        items={items}
      />
    </div>
  );
};

export default WorkSpaceTab;
