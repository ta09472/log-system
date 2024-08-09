import _ from "lodash";
import instance from "../lib/axios";
import { Raw, RawParams } from "../schema/raw";
import errorHandleByCode from "../util/error";

export const raw = {
  getLogData: async (params: RawParams) => {
    const newObj = _.omit(params, "searchType");
    const convertedParams = {
      ...newObj,
      from: new Date(newObj.from ?? "").getTime(),
      to: new Date(newObj.to ?? "").getTime(),
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
};
