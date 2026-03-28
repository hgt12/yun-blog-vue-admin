import request from "@/utils/request";

/**
 * 天气类型
 */
export enum WeatherType {
  SUNNY = "sunny", // 晴天
  OVERCAST = "overcast", // 阴天
  RAINING = "raining", // 下雨
  SNOWING = "snowing", // 下雪
}

/**
 * 天气信息响应
 */
export interface WeatherInfo {
  weather: WeatherType;
  temperature: number;
  location: string;
}

/**
 * 获取当前位置的天气信息
 */
export function getWeatherInfo() {
  return request<any, WeatherInfo>({
    url: "/weather/current",
    method: "get",
  });
}
