import { ref, computed, onMounted, onUnmounted } from "vue";
import { getWeatherNow, WeatherType } from "@/api/weather";
import { useSettingsStore } from "@/store";
import { ThemeMode } from "@/enums";

type TimePeriod = "morning" | "afternoon" | "evening";

/**
 * 天气背景图片管理
 */
export function useWeatherBackground() {
  const settingsStore = useSettingsStore();
  const weather = ref<WeatherType | null>(null);
  const timePeriod = ref<TimePeriod>("morning");
  const isLoading = ref(true);

  /**
   * 根据小时获取时间段
   */
  function getTimePeriodByHour(hour: number): TimePeriod {
    if (hour >= 6 && hour < 15) {
      return "morning";
    }
    if (hour >= 15 && hour < 18) {
      return "afternoon";
    }
    return "evening";
  }

  /**
   * 更新时间段
   */
  function updateTimePeriod() {
    const currentHour = new Date().getHours();
    timePeriod.value = getTimePeriodByHour(currentHour);
  }

  /**
   * 获取天气类型
   */
  async function fetchWeather() {
    try {
      const data = await getWeatherNow();
      weather.value = data.weatherType;
    } catch (error) {
      // 静默失败，使用默认晴天背景，不影响用户体验
      console.warn("获取天气类型失败，使用默认晴天背景", error);
      weather.value = WeatherType.SUNNY;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 背景图片映射
   */
  const backgroundImageMap: Record<WeatherType, Record<TimePeriod, string>> = {
    [WeatherType.SUNNY]: {
      morning: "/background_image_sunny_morning.png",
      afternoon: "/background_image_sunny_afternoon.png",
      evening: "/background_image_sunny_evening.png",
    },
    [WeatherType.OVERCAST]: {
      morning: "/background_image_overcast_morning.png",
      afternoon: "/background_image_overcast_afternoon.png",
      evening: "/background_image_overcast_evening.png",
    },
    [WeatherType.RAINING]: {
      morning: "/background_image_raining_morning.png",
      afternoon: "/background_image_raining_afternoon.png",
      evening: "/background_image_raining_evening.png",
    },
    [WeatherType.SNOWING]: {
      morning: "/background_image_snowing_morning.png",
      afternoon: "/background_image_snowing_afternoon.png",
      evening: "/background_image_snowing_evening.png",
    },
    [WeatherType.FOG]: {
      morning: "/background_image_fog_morning.png",
      afternoon: "/background_image_fog_afternoon.png",
      evening: "/background_image_fog_evening.png",
    },
  };

  /**
   * 当前背景图片
   * 天气数据未加载完成时返回空字符串
   * 如果是暗黑主题，使用当前天气的evening背景
   * 否则根据天气和时间段选择背景
   */
  const currentBackgroundImage = computed(() => {
    if (!weather.value) {
      return "";
    }
    if (settingsStore.theme === ThemeMode.DARK) {
      return backgroundImageMap[weather.value].evening;
    }
    return backgroundImageMap[weather.value][timePeriod.value];
  });

  /**
   * 初始化
   */
  onMounted(() => {
    updateTimePeriod();
    fetchWeather();

    // 每30分钟更新一次天气
    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    // 每分钟检查时间段变化
    const timeInterval = setInterval(updateTimePeriod, 60 * 1000);

    // 清理定时器
    onUnmounted(() => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    });
  });

  return {
    weather,
    timePeriod,
    isLoading,
    currentBackgroundImage,
  };
}
