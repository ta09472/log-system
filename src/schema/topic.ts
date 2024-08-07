export type Filed = {
  fieldName: string;
  fieldType: string;
};

export type Topic = {
  id: number;
  topicName: string;
  topicDescription: string;
  fields: Filed[];
};
