import { Button, Divider, Input, InputRef, message, Modal, Select } from "antd";
import { Topic } from "../schema/topic";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../api";
import { useSearchParams } from "react-router-dom";
import { PutTopicParams } from "../api/topic";

const options = [
  { value: "string", label: "string" },
  { value: "number", label: "number" },
  { value: "boolean", label: "boolean" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function WorkspaceEditModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const ref = useRef<InputRef>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const workspaceId = searchParams.get("workspace") ?? "";

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });
  const target = data?.data.find(datum => datum.id.toString() === workspaceId);

  const { mutateAsync: editTopic, isLoading } = useMutation({
    mutationFn: api.topic.editTopic,
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard"]);
      onClose();
    },
  });

  const [params, setParams] = useState<Topic | undefined>(target);

  const onChange = (v: string, key: string) => {
    switch (key) {
      case "topicName":
        setParams(prev => {
          return { ...prev, topicName: v } as Topic;
        });
        break;
      case "topicDescription":
        setParams(prev => {
          return { ...prev, topicDescription: v } as Topic;
        });
        break;

      default:
        break;
    }
  };

  const onSubmit = () => {
    if (!params) return;

    editTopic(params as PutTopicParams);
  };

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        keyboard
        classNames={{
          footer: "m-0",
        }}
        okText="Save"
        centered
        open={open}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        okButtonProps={{
          block: true,
          className: "bg-black hover:opacity-75",
          disabled: !params?.fields.every(
            v => v.fieldName?.trim() !== "" && v.fieldType?.trim() !== ""
          ),
        }}
        onCancel={onClose}
        onOk={onSubmit}
        title="Topic Edit"
        loading={isLoading}
      >
        <div className="flex flex-col gap-2 mt-8">
          <div className="flex gap-2 items-center">
            <div className="min-w-20">Name</div>
            <Input
              disabled
              variant="filled"
              value={params?.topicName}
              onChange={({ target }) => onChange(target.value, "topicName")}
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="min-w-20">Description</div>
            <Input
              variant="filled"
              value={params?.topicDescription}
              onChange={({ target }) =>
                onChange(target.value, "topicDescription")
              }
            />
          </div>
          <Divider />
          <div className="flex gap-2 items-center">
            <div className="flex justify-between w-full">
              <div>Data Fields</div>
              <Button
                onClick={() => {
                  const isNotBlank = params?.fields.every(
                    v =>
                      v.fieldName?.trim() !== "" && v.fieldType?.trim() !== ""
                  );

                  if (!isNotBlank) {
                    messageApi.open({
                      type: "warning",
                      content: "Some data fields are incomplete.",
                    });
                    ref?.current?.focus();
                    return;
                  }
                  setParams(prev => {
                    return {
                      ...prev,
                      fields: [
                        ...(prev?.fields ?? []),
                        {
                          fieldName: "",
                          fieldType: options.at(0)?.value,
                        },
                      ],
                    } as Topic;
                  });
                }}
                type="text"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                }
              />
            </div>
          </div>
          {params?.fields.map((v, i) => {
            return (
              <div className=" flex justify-between gap-4">
                <Input
                  placeholder="데이터 필드 이름을 입력해주세요."
                  ref={ref}
                  value={v.fieldName}
                  className="basis-2/3"
                  variant="filled"
                  disabled={!!target?.fields.at(i)?.fieldName}
                  onChange={({ currentTarget }) => {
                    const newValue = { ...v, fieldName: currentTarget.value };
                    const updatedArray = params?.fields.map((item, index) =>
                      index === i ? newValue : item
                    );

                    setParams(prev => {
                      return {
                        ...prev,
                        fields: updatedArray,
                      } as Topic;
                    });
                  }}
                />
                <Select
                  value={v.fieldType}
                  options={options}
                  disabled={!!target?.fields.at(i)?.fieldType}
                  className=" basis-1/3"
                  onChange={value => {
                    const newValue = { ...v, fieldType: value };
                    const updatedArray = params?.fields.map((item, index) =>
                      index === i ? newValue : item
                    );

                    setParams(prev => {
                      return {
                        ...prev,
                        fields: updatedArray,
                      } as Topic;
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
