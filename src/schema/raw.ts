export type Raw = {
  totalResultCount: number;
  result: [
    {
      topicName: "string";
      timestamp: number;
      data: {
        additionalProp1: object;
        additionalProp2: object;
        additionalProp3: object;
      };
    },
  ];
};

export type RawParams = {
  topicName?: string;
  from?: string;
  to?: string;
  searchType: "raw" | "statics";
  condition?: { fieldName: string; keyword: string; equal: boolean }[];
};
