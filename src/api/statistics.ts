import instance from "../lib/axios";
import errorHandleByCode from "../util/error";

export const statistics = {
  getSpasticsData: async params => {
    const newObj = _.omit(params, "searchType");
    const convertedParams = {
      ...newObj,
      from: new Date(newObj.from ?? "").getTime(),
      to: new Date(newObj.to ?? "").getTime(),
    };

    try {
      const response = await instance.post<[]>(
        "/api/agg-data",
        convertedParams
      );

      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
};
