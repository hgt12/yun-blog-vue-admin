import request from "@/utils/request";
import type {
  VisitTrendQueryParams,
  VisitTrendDetail,
  VisitStatsDetail,
  RecordVisitDetail,
} from "@/types/api";

const STATISTICS_BASE_URL = "/statistics";

const StatisticsAPI = {
  /** 获取访问趋势统计 */
  getVisitTrend(queryParams: VisitTrendQueryParams) {
    return request<any, VisitTrendDetail>({
      url: `${STATISTICS_BASE_URL}/visits/trend`,
      method: "get",
      params: queryParams,
    });
  },
  /** 获取访问概览统计 */
  getVisitOverview() {
    return request<any, VisitStatsDetail>({
      url: `${STATISTICS_BASE_URL}/visits/overview`,
      method: "get",
    });
  },
  /** 记录页面访问日志 */
  recordVisit(data: RecordVisitDetail) {
    return request<any, void>({
      url: `${STATISTICS_BASE_URL}/visits/recordVisit`,
      method: "post",
      data,
      headers: {
        token: "no-auth",
      },
    });
  },
};

export default StatisticsAPI;
