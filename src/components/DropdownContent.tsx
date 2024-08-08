import {
  Button,
  DatePicker,
  Divider,
  Input,
  InputRef,
  message,
  Radio,
  Select,
  Switch,
} from "antd";
import { LegacyRef, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import api from "../api";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import disabled7DaysDate from "../util/dateRange";
import { RawParams } from "../schema/raw";
import dayjs from "dayjs";
import { NoUndefinedRangeValueType } from "rc-picker/lib/PickerInput/RangePicker";

interface Props {
  ref: LegacyRef<InputRef> | undefined;
  onClose: () => void;
}

const initialForm: RawParams = {
  topicName: undefined,
  searchType: "raw",
  from: undefined,
  to: undefined,
  condition: [{ fieldName: "", keyword: "", equal: true }],
};

export default function DropdownContent({ ref, onClose }: Props) {
  // 이거 URL params로 조져야됨
  const [form, setForm] = useState<RawParams>(initialForm);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const { mutate, isLoading } = useMutation(api.raw.getLogData);

  const target = data?.data.find(
    ({ topicName }) => topicName === form?.topicName
  );

  const dataFiledOptions = target?.fields.map(({ fieldName }) => ({
    label: fieldName,
    value: fieldName,
  }));

  const options = data?.data.map(v => ({
    label: v.topicName,
    value: v.topicName,
  }));

  useEffect(() => {
    if (pathname.includes("/results")) {
      const topicName = searchParams.get("topicName") ?? initialForm.topicName;
      const from = searchParams.get("start") ?? initialForm.from;
      const to = searchParams.get("end") ?? initialForm.to;
      const searchType =
        searchParams.get("searchType") ?? initialForm.searchType;
      const condition =
        JSON.parse(searchParams.get("conditions") ?? "") ??
        initialForm.topicName;

      setForm({
        topicName,
        from,
        to,
        condition,
        searchType: searchType as "raw" | "statics",
      });
    }
  }, []);

  const onTopicChange = (value: string) => {
    setForm(prev => {
      return {
        ...prev,
        topicName: value,
      } as RawParams;
    });
  };

  const onKeywordChange = (v: string, id: number) => {
    setForm(prev => {
      // 새로운 배열 생성
      const updatedArray = prev.condition?.map((item, index) =>
        index === id ? { ...item, keyword: v } : item
      );
      return {
        ...prev,
        condition: updatedArray,
      } as RawParams;
    });
  };

  const onFieldChange = (v: string, id: number) => {
    setForm(prev => {
      // 새로운 배열 생성
      const updatedArray = prev.condition?.map((item, index) =>
        index === id ? { ...item, fieldName: v } : item
      );
      return {
        ...prev,
        condition: updatedArray,
      } as RawParams;
    });
  };

  const onSearchTypeChange = (v: "raw" | "statics") => {
    setForm(prev => {
      return {
        ...prev,
        searchType: v,
      } as RawParams;
    });
  };

  const onCriteriaChange = (v: boolean, id: number) => {
    setForm(prev => {
      // 새로운 배열 생성
      const updatedArray = prev.condition?.map((item, index) =>
        index === id ? { ...item, equal: v } : item
      );
      return {
        ...prev,
        condition: updatedArray,
      } as RawParams;
    });
  };

  const onDateChange = (v: NoUndefinedRangeValueType<dayjs.Dayjs> | null) => {
    if (!v) return;

    setForm(prev => {
      return {
        ...prev,
        from: dayjs(v[0]).format("YYYY-MM-DD HH:mm:ss"),
        to: dayjs(v[1]).format("YYYY-MM-DD HH:mm:ss"),
      } as RawParams;
    });
  };

  const addCondition = () => {
    // 조건 다시 확인
    if (form.condition?.some(v => v.keyword === "" || v.fieldName === "")) {
      message.warning("Please fill in the search criteria.");
      return;
    }

    setForm(prev => {
      const newVal = [
        ...(prev?.condition ?? []),
        {
          fieldName: "",
          keyword: "",
          equal: true,
        },
      ];
      return {
        ...prev,
        condition: newVal,
      } as RawParams;
    });
  };

  const removeCondition = (id: number) => {
    setForm(prev => {
      const newVal = prev?.condition?.filter((v, index) => {
        console.log(id, index);
        return index !== id;
      });
      return {
        ...prev,
        condition: newVal,
      } as RawParams;
    });
  };

  const isInvalid = !(
    form.from &&
    form.searchType &&
    form.to &&
    form.topicName &&
    !form.condition?.some(v => v.keyword === "" || v.fieldName === "")
  );

  return (
    <div className="px-2 w-full rounded-md flex-col shadow-md">
      <div className="flex justify-between gap-4 w-full items-center pt-1">
        <div className="pl-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="#7c7c7c"
            className="size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <Input
            size="large"
            ref={ref}
            placeholder="Search"
            onKeyDown={e => {
              if (e.key === "Escape") onClose();
            }}
            variant="borderless"
          />
        </div>

        <Button onClick={onClose} type="text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="#7c7c7c"
            className="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
      <div className="p-3 flex-col">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 ">
            <div className="font-semibold text-lg">Topic</div>
            <Select
              variant="filled"
              className=" w-full"
              showSearch
              value={form?.topicName}
              placeholder="Select Topic"
              optionFilterProp="label"
              onChange={onTopicChange}
              options={options}
            />
          </div>

          <Divider />
          <div className="font-semibold text-lg">Data Type</div>
          <Radio.Group
            defaultValue="raw"
            value={form.searchType}
            optionType="button"
            buttonStyle="solid"
            onChange={v => onSearchTypeChange(v.target.value)}
          >
            <Radio.Button value="raw">Raw Data</Radio.Button>
            <Radio.Button value="statics">Statics Data</Radio.Button>
          </Radio.Group>

          {form.topicName && (
            <>
              <Divider />
              <div className="font-semibold text-lg">Search Condition</div>
              <div className=" text-neutral-500">Date</div>
              <DatePicker.RangePicker
                value={[dayjs(form.from), dayjs(form.to)]}
                variant="filled"
                disabledDate={disabled7DaysDate}
                onChange={c => onDateChange(c)}
              />

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
              <div className="flex-col gap-2 flex overflow-auto max-h-40 py-1">
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
                        onKeywordChange(
                          currentTarget.value.toLocaleLowerCase(),
                          id
                        )
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
          <div className=" flex gap-2 mt-4">
            <Button
              block
              type="text"
              onClick={() => setForm(initialForm)}
              className="basis-/2"
            >
              Clear
            </Button>
            <Button
              loading={isLoading}
              disabled={isInvalid}
              block
              type="primary"
              onClick={() => {
                const url = `/results?topicName=${encodeURIComponent(form.topicName ?? "")}&searchType=${encodeURIComponent(form.searchType ?? "")}&start=${encodeURIComponent(form.from ?? "")}&end=${encodeURIComponent(form.to ?? "")}&conditions=${encodeURIComponent(JSON.stringify(form.condition))}`;

                mutate(form);

                navigate(url);
                onClose();
              }}
              className="basis-/2"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
