import _ from "lodash";
import instance from "../lib/axios";
import { Raw, RawParams } from "../schema/raw";
import errorHandleByCode from "../util/error";

type Params = RawParams & { pageSize?: number; pageNo?: number };

export const raw = {
  getLogData: async (params: Params) => {
    const newObj = _.omit(params, "searchType");
    const convertedParams = {
      ...newObj,
      from: new Date(newObj.from ?? "").getTime(),
      to: new Date(newObj.to ?? "").getTime(),
      pageSize: params.pageSize ?? 8000,
      pageNo: params.pageNo ?? 0,
    };

    try {
      const response = await instance.post<Raw>(
        "/api/log-data",
        convertedParams
      );

      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
  getAggregationData: async (params: RawParams) => {
    const newObj = _.omit(params, "searchType");
    const convertedParams = {
      ...newObj,
      from: new Date(newObj.from ?? "").getTime(),
      to: new Date(newObj.to ?? "").getTime(),
    };

    try {
      const response = await instance.post<Raw>(
        "/api/log-data/aggregation",
        convertedParams
      );

      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
};
