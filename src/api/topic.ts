import instance from "../lib/axios";
import { Filed, Topic } from "../schema/topic";
import errorHandleByCode from "../util/error";

type CreateTopicParams = {
  topicName: string;
  topicDescription?: string;
  fields?: Filed | [];
};

export type PutTopicParams = CreateTopicParams & { id: number };
type DeleteTopicParams = { id: number };

export const topic = {
  getTopicList: async () => {
    try {
      const response = await instance.get<Topic[]>("/api/topic/list");

      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
  createTopic: async ({
    topicName,
    topicDescription = "",
    fields = [],
  }: CreateTopicParams) => {
    try {
      const response = await instance.post("/api/topic", {
        topicName,
        topicDescription,
        partitions: 1,
        replicationFactor: 1,
        fields,
      });

      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
  editTopic: async ({
    id,
    topicName,
    topicDescription,
    fields,
  }: PutTopicParams) => {
    try {
      const response = await instance.put("/api/topic", {
        id,
        topicName,
        topicDescription,
        fields,
      });
      console.log(response);
      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
  deleteTopic: async ({ id }: DeleteTopicParams) => {
    try {
      const response = await instance.delete(`/api/topic/${id}`);
      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
};
