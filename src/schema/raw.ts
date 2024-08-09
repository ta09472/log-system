export type Raw = {
  totalResultCount: number;
  result: [
    {
      topicName: string;
      timestamp: number;
      data: {
        additionalProp1: object;
        additionalProp2: object;
        additionalProp3: object;
      };
    },
  ];
};

type Condition = { fieldName: string; keyword: string; equal: boolean };

export type RawParams = {
  topicName?: string;
  from?: string;
  to?: string;
  condition?: Condition[];
  // 내가 편하려고 넣은 타입
  searchType: "raw" | "statics";
};

export type AggParams = {
  topicName: string;
  from: number;
  to: number;
  searchSettings: [
    {
      settingName: string;
      conditionList: Condition[];
    },
  ];
};
