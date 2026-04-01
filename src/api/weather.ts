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
  /** 天气类型 */
  weatherType: WeatherType;
  /** 云量百分比 */
  cloud: string;
  /** 露点温度 */
  dew: string;
  /** 体感温度 */
  feelsLike: string;
  /** 相对湿度百分比 */
  humidity: string;
  /** 天气图标代码 */
  icon: string;
  /** 观测时间 */
  obsTime: string;
  /** 降水量(毫米) */
  precip: string;
  /** 大气压强(百帕) */
  pressure: string;
  /** 温度(摄氏度) */
  temp: string;
  /** 天气状况文字描述 */
  text: string;
  /** 能见度(公里) */
  vis: string;
  /** 风向360角度 */
  wind360: string;
  /** 风向文字描述 */
  windDir: string;
  /** 风力等级 */
  windScale: string;
  /** 风速(公里/小时) */
  windSpeed: string;
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
