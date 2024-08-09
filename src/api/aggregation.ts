import instance from "../lib/axios";
import { Aggregation } from "../schema/aggregation";
import errorHandleByCode from "../util/error";

export const aggregation = {
  // getSpasticsData: async params => {
  //   const newObj = _.omit(params, "searchType");
  //   const convertedParams = {
  //     ...newObj,
  //     from: new Date(newObj.from ?? "").getTime(),
  //     to: new Date(newObj.to ?? "").getTime(),
  //   };
  //   try {
  //     const response = await instance.post<[]>(
  //       "/api/agg-data",
  //       convertedParams
  //     );
  //     return response;
  //   } catch (error) {
  //     errorHandleByCode(error);
  //   }
  // },
  createCondition: async (params: Aggregation) => {
    try {
      const response = await instance.post<[]>("/api/aggregation", params);
      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
  getCondition: async (topicName: string) => {
    try {
      const response = await instance.get<[]>(
        `/api/aggregation/list/${topicName}`
      );
      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },

  deleteCondition: async (id: number) => {
    try {
      const response = await instance.delete<[]>(`/api/aggregation/list/${id}`);
      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
};
