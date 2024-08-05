export type Filed = {
  filedName: string;
  filedType: string;
};

export type Topic = {
  id: number;
  topicName: string;
  topicDescription: string;
  fields: Filed[];
};
