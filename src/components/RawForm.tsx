import { Button, Divider, Input, Select, Switch } from "antd";
import { RawParams } from "../schema/raw";

interface Props {
  form: RawParams;
  dataFiledOptions:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
  addCondition: () => void;
  onFieldChange: (v: string, id: number) => void;
  onKeywordChange: (v: string, id: number) => void;
  onCriteriaChange: (v: boolean, id: number) => void;
  removeCondition: (id: number) => void;
}

export default function RawForm({
  form,
  addCondition,
  dataFiledOptions,
  onFieldChange,
  onCriteriaChange,
  onKeywordChange,
  removeCondition,
}: Props) {
  return (
    <div key={form.topicName}>
      {form.topicName && (
        <>
          <Divider />
          <div className="font-semibold text-lg">Search Condition</div>

          <div className=" flex items-center justify-between text-neutral-500">
            {form.condition?.length === 0 ? (
              <div className="line-through">Keyword</div>
            ) : (
              "Keyword"
            )}

            <Button
              type="text"
              className="p-0 m-0"
              onClick={() => {
                addCondition();
              }}
            >
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
            </Button>
          </div>
          {form.condition?.length === 0 ? (
            <div className="text-neutral-500  text-center">
              Search without specifying keywords.
            </div>
          ) : (
            <div className=" flex">
              <div className="text-neutral-500 basis-1/12">#</div>
              <div className="text-neutral-500 basis-3/12 pl-[5.5px]">
                Data Field
              </div>
              <div className="text-neutral-500 basis-5/12  pl-[5.5px]">
                Keyword
              </div>
              <div className="text-neutral-500 basis-2/12  ">
                Match Criteria
              </div>
            </div>
          )}
          <div className="flex-col gap-2 flex overflow-auto max-h-28 py-1">
            {form?.condition?.map((v, id) => (
              <div className=" w-full flex gap-2 items-center">
                <div className="text-neutral-500 basis-1/12">{id + 1}</div>
                <Select
                  variant="filled"
                  className="basis-3/12"
                  options={dataFiledOptions}
                  onChange={v => onFieldChange(v, id)}
                  value={v.fieldName}
                />
                <Input
                  variant="filled"
                  value={v.keyword}
                  className="basis-5/12"
                  placeholder="Enter the keyword you are looking for"
                  onChange={({ currentTarget }) =>
                    onKeywordChange(currentTarget.value, id)
                  }
                />
                <Switch
                  value={v.equal}
                  className="basis-2/12"
                  checkedChildren="Exactly"
                  unCheckedChildren="Contains"
                  defaultChecked
                  onChange={v => onCriteriaChange(v, id)}
                />
                <Button
                  className="text-neutral-500 basis-1/12"
                  type="text"
                  key={`${v.fieldName}_${v.keyword}_${id}`}
                  onClick={() => {
                    removeCondition(id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}
    </div>
  );
}
