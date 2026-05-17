import request from "@/utils/request";
import type { LogQueryParams, LogItem } from "@/types/api";

const LOG_BASE_URL = "/logs";

const LogAPI = {
  /** 获取日志分页列表 */
  getPage(queryParams: LogQueryParams) {
    return request<any, PageResult<LogItem>>({
      url: `${LOG_BASE_URL}`,
      method: "get",
      params: queryParams,
    });
  },

  /** 导出日志 */
  export(queryParams: Partial<LogQueryParams>) {
    return request({
      url: `${LOG_BASE_URL}/export`,
      method: "get",
      params: queryParams,
      responseType: "blob",
    });
  },
};

export default LogAPI;
