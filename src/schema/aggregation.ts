export type Aggregation = {
  topicName: string;
  settingName: string;
  condition: [
    {
      fieldName: string;
      keyword: string;
      equal: boolean;
    },
  ];
};
