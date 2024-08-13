import {
  Button,
  DatePicker,
  Divider,
  Input,
  InputRef,
  message,
  Radio,
  Select,
} from "antd";
import { LegacyRef, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import api from "../api";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { RawParams } from "../schema/raw";
import dayjs from "dayjs";
import { NoUndefinedRangeValueType } from "rc-picker/lib/PickerInput/RangePicker";
import customLocalStorage from "../util/localstorage";
import SearchHistory from "./SearchHistory";
import RawForm from "./RawForm";
import AggregationForm from "./AggregationForm";
import disabled7DaysDate from "../util/dateRange";
import { LogAggregationParams } from "../schema/aggregation";

interface Props {
  ref: LegacyRef<InputRef> | undefined;
  onClose: () => void;
}

const initialForm: RawParams = {
  topicName: undefined,
  searchType: "raw",
  from: dayjs().subtract(1, "day").toISOString(),
  to: dayjs().toISOString(),
  condition: [{ fieldName: "", keyword: "", equal: true }],
};

type AggForm = LogAggregationParams & { searchType: "raw" | "statics" };
const aggInitialForm: AggForm = {
  topicName: "",
  searchType: "statics",
  from: dayjs().subtract(1, "day").toISOString(),
  to: dayjs().toISOString(),
  searchSettings: [
    {
      settingName: "",
      conditionList: [{ fieldName: "", keyword: "", equal: true }],
    },
  ],
};

export default function DropdownContent({ ref, onClose }: Props) {
  const [form, setForm] = useState<RawParams>(initialForm);
  const [aggForm, setAggForm] = useState<AggForm>(aggInitialForm);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.topic.getTopicList(),
  });

  const { mutate, isLoading } = useMutation(api.raw.getLogData);

  const target = data?.data.find(
    ({ topicName }) => topicName === form?.topicName
  );

  const topicName = searchParams.get("topicName") ?? initialForm.topicName;
  const from = searchParams.get("start") ?? initialForm.from;
  const to = searchParams.get("end") ?? initialForm.to;
  const searchType = searchParams.get("searchType") ?? initialForm.searchType;

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

      if (searchType === "raw") {
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
        return;
      }

      const aggCondition =
        JSON.parse(searchParams.get("aggConditions") ?? "") ??
        aggInitialForm.searchSettings;

      setAggForm({
        to: to ?? "",
        topicName: topicName ?? "",
        searchType: searchType as "raw" | "statics",
        from: from ?? "",
        // URL에서 가져오기
        searchSettings: aggCondition,
      });
    }
  }, [search]);

  console.log(form);
  console.log(aggForm);

  const onTopicChange = (value: string) => {
    setForm(prev => {
      return {
        ...prev,
        topicName: value,
      } as RawParams;
    });

    setAggForm(prev => {
      return {
        ...prev,
        topicName: value,
      };
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

    setAggForm(prev => {
      return {
        ...prev,
        searchType: v,
      };
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

    setAggForm(prev => {
      return {
        ...prev,
        from: dayjs(v[0]).format("YYYY-MM-DD HH:mm:ss"),
        to: dayjs(v[1]).format("YYYY-MM-DD HH:mm:ss"),
      };
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

  const isAggInvalid = !aggForm?.searchSettings.every(
    setting =>
      setting.settingName !== "" &&
      setting.conditionList.every(
        condition => condition.fieldName !== "" && condition.keyword !== ""
      )
  );
  // `searchType`에 따라 적절한 `searchType` 값 선택

  const value = {
    searchType: searchType === "raw" ? form.searchType : aggForm.searchType,
    topicName: searchType === "raw" ? form.topicName : aggForm.topicName,
    from: searchType === "raw" ? form.from : aggForm.from,
    to: searchType === "raw" ? form.to : aggForm.to,
  };

  return (
    <div className="px-2 w-full rounded-md flex-col shadow-md">
      <div className="flex justify-between gap-4 w-full items-center pt-1">
        <div className="pl-2 flex items-center">
          {/* <svg
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
          </svg> */}
          {/* <Input
            size="large"
            ref={ref}
            placeholder="Search"
            onKeyDown={e => {
              if (e.key === "Escape") onClose();
            }}
            variant="borderless"
          /> */}
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
              value={value?.topicName}
              placeholder="Select Topic"
              optionFilterProp="label"
              onChange={onTopicChange}
              options={options}
            />
          </div>

          <Divider />
          <div className=" flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg mb-2">Data Type</div>
              <Radio.Group
                defaultValue="raw"
                value={value.searchType}
                optionType="button"
                buttonStyle="solid"
                onChange={v => onSearchTypeChange(v.target.value)}
              >
                <Radio.Button value="raw">Raw Data</Radio.Button>
                <Radio.Button value="statics">Statics Data</Radio.Button>
              </Radio.Group>
            </div>
            <div>
              <div className="font-semibold text-lg mb-2">Date</div>
              <DatePicker.RangePicker
                value={[dayjs(value.from), dayjs(value.to)]}
                variant="filled"
                disabledDate={disabled7DaysDate}
                onChange={c => onDateChange(c)}
              />
            </div>
          </div>
          {/* RawForm이냐 AggregationForm이냐 */}
          {value.searchType === "raw" ? (
            <RawForm
              form={form}
              dataFiledOptions={dataFiledOptions}
              addCondition={addCondition}
              onFieldChange={onFieldChange}
              onKeywordChange={onKeywordChange}
              onCriteriaChange={onCriteriaChange}
              removeCondition={removeCondition}
            />
          ) : (
            <AggregationForm form={aggForm} setForm={setAggForm} />
          )}
          <SearchHistory onClose={onClose} />
          <div className=" flex gap-2 mt-2">
            <Button
              block
              type="text"
              onClick={() => {
                setForm(initialForm);
                setAggForm(aggInitialForm);
              }}
              className="basis-/2"
            >
              Clear
            </Button>
            <Button
              loading={isLoading}
              disabled={
                (form?.searchType === "raw" && isInvalid) ||
                (form?.searchType === "statics" && isAggInvalid)
              }
              block
              type="primary"
              onClick={() => {
                if (form.searchType === "raw") {
                  const url = `/results?topicName=${encodeURIComponent(form.topicName ?? "")}&searchType=${encodeURIComponent(form.searchType ?? "")}&start=${encodeURIComponent(form.from ?? "")}&end=${encodeURIComponent(form.to ?? "")}&conditions=${encodeURIComponent(JSON.stringify(form.condition))}`;
                  mutate(form);

                  if (customLocalStorage.getItem("form")) {
                    // 검색기록이 이미 있다면 배열에 추가
                    customLocalStorage.addItem("form", form);
                    navigate(url);
                    onClose();
                    return;
                  }
                  // 검색기록이 없다면 새로만들기

                  customLocalStorage.createItem("form", form);
                  navigate(url);
                  onClose();
                  return;
                } else {
                  const url = `/results?topicName=${encodeURIComponent(aggForm.topicName ?? "")}&searchType=${encodeURIComponent(aggForm.searchType ?? "")}&start=${encodeURIComponent(aggForm.from ?? "")}&end=${encodeURIComponent(aggForm.to ?? "")}&aggConditions=${encodeURIComponent(JSON.stringify(aggForm.searchSettings))}`;

                  navigate(url);
                  onClose();
                }
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
