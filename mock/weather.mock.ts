import { defineMock } from "./base";

export default defineMock([
  {
    url: "/weather/current",
    method: ["GET"],
    body: () => {
      // 模拟随机天气
      const weathers = ["sunny", "overcast", "raining", "snowing"];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];

      return {
        code: "00000",
        data: {
          weather: randomWeather,
          temperature: Math.floor(Math.random() * 30) + 5, // 5-35度
          location: "北京市",
        },
        msg: "获取成功",
      };
    },
  },
]);
