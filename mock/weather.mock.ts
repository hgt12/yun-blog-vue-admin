import { defineMock } from "./base";

export default defineMock([
  // 获取天气信息接口
  {
    url: "/weather/now",
    method: ["GET"],
    body: () => {
      // 模拟返回完整的天气数据
      const weatherTypes = ["sunny", "overcast", "raining", "snowing", "fog"];
      const weatherTexts = ["晴", "阴", "雨", "雪", "雾"];
      const randomIndex = Math.floor(Math.random() * weatherTypes.length);

      return {
        code: "00000",
        data: {
          cloud: "100",
          dew: "17",
          feelsLike: "15",
          humidity: "92",
          icon: "399",
          obsTime: new Date().toISOString(),
          precip: "0.9",
          pressure: "1007",
          temp: String(Math.floor(Math.random() * 15) + 10), // 10-25度随机
          text: weatherTexts[randomIndex],
          vis: "20",
          weatherType: weatherTypes[randomIndex],
          wind360: "30",
          windDir: "东北风",
          windScale: "1",
          windSpeed: "5",
        },
        msg: "操作成功",
      };
    },
  },
]);
