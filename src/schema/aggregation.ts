export type Aggregation = {
  id: number;
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
    data: {
      timestamp: number;
      count: number;
    }[];
  }[];
};

export type LogAggregationResponse = {
  topicName: string;
  result: {
    settingName: string;
    data: {
      timestamp: number;
      count: number;
    }[];
  }[];
};

export type LogAggregationParams = {
  from: string;
  to: string;
  topicName: string;
  searchSettings: {
    settingName: string;
    conditionList: {
      fieldName: string;
      keyword: string;
      equal: true;
    }[];
  }[];
};
