import { defineMock } from "./base";

export default defineMock([
  // 获取天气类型接口（后端根据用户信息返回对应的天气类型）
  {
    url: "/weather/now",
    method: ["GET"],
    body: () => {
      // 模拟后端返回不同的天气类型
      const weatherTypes = ["sunny", "overcast", "raining", "snowing"];
      const randomType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

      return {
        code: "00000",
        data: {
          weatherType: randomType,
        },
        msg: "获取成功",
      };
    },
  },
]);
