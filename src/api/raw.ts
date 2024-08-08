import instance from "../lib/axios";
import { Raw, RawParams } from "../schema/raw";
import errorHandleByCode from "../util/error";

export const raw = {
  getLogData: async (params: RawParams) => {
    const convertedParams = {
      ...params,
      from: new Date(params.from ?? "").getTime(),
      to: new Date(params.to ?? "").getTime(),
    };

    try {
      const response = await instance.post<Raw[]>(
        "/api/log-data",
        convertedParams
      );

      return response;
    } catch (error) {
      errorHandleByCode(error);
    }
  },
};
