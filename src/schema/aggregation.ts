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

export type RealtimeData = {
  topicName: string;
  result: {
    settingName: string;
    data: [
      {
        timestamp: number;
        count: number;
      },
    ];
  }[];
};
