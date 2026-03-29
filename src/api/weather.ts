import request from "@/utils/request";

/**
 * 天气类型
 */
export enum WeatherType {
  SUNNY = "sunny", // 晴天
  OVERCAST = "overcast", // 阴天
  RAINING = "raining", // 下雨
  SNOWING = "snowing", // 下雪
  FOG = "fog", // 雾/霾
}

/**
 * 天气信息响应
 */
export interface WeatherNowResponse {
  weatherType: WeatherType;
}

/**
 * 获取天气类型
 * 后端根据用户信息返回对应的天气类型
 */
export function getWeatherNow() {
  return request<any, WeatherNowResponse>({
    url: "/weather/now",
    method: "get",
    headers: { token: "no-auth" },
  });
}
