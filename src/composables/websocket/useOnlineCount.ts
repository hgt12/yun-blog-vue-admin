import { ref, onMounted, onUnmounted, getCurrentInstance, readonly, computed } from "vue";
import { useStomp } from "./useStomp";
import { AuthStorage } from "@/utils/auth";

/**
 * 在线用户数量消息结构
 */
interface OnlineCountMessage {
  count?: number;
  timestamp?: number;
}

type OnlineCountMode = "admin" | "blog";

const ONLINE_COUNT_TOPICS: Record<OnlineCountMode, string> = {
  admin: "/topic/admin/online-count",
  blog: "/topic/blog/online-count",
};

const VISITOR_ONLINE_COUNT_TOPIC = "/topic/blog/visitor/online-count";

/**
 * 全局单例实例
 */
let globalInstance: ReturnType<typeof createOnlineCountComposable> | null = null;

/**
 * 创建在线用户计数组合式函数（内部工厂函数）
 */
function createOnlineCountComposable() {
  // ==================== 状态管理 ====================
  const onlineUserCount = ref(0);
  const visitorCount = ref(0);
  const lastUpdateTime = ref(0);
  const mode = ref<OnlineCountMode>("admin");

  const totalCount = computed(() => onlineUserCount.value + visitorCount.value);

  // ==================== WebSocket 客户端 ====================
  const stomp = useStomp({
    reconnectDelay: 15000,
    maxReconnectAttempts: 3,
    connectionTimeout: 10000,
    useExponentialBackoff: true,
    autoRestoreSubscriptions: true, // 自动恢复订阅
    debug: false,
  });

  // 订阅 ID
  let onlineCountSubscriptionId: string | null = null;
  let visitorCountSubscriptionId: string | null = null;

  const getTopic = () => ONLINE_COUNT_TOPICS[mode.value];
  const getVisitorTopic = () => VISITOR_ONLINE_COUNT_TOPIC;

  /**
   * 处理在线用户数量消息
   */
  const handleOnlineCountMessage = (message: any) => {
    try {
      const data = message.body;
      const jsonData = JSON.parse(data) as OnlineCountMessage;

      // 支持两种消息格式
      // 1. 直接是数字: 42
      // 2. 对象格式: { count: 42, timestamp: 1234567890 }
      const count = typeof jsonData === "number" ? jsonData : jsonData.count;

      if (count !== undefined && !isNaN(count)) {
        onlineUserCount.value = count;
        lastUpdateTime.value = Date.now();
      } else {
        console.warn("[useOnlineCount] 收到无效的在线用户数:", data);
      }
    } catch (error) {
      console.error("[useOnlineCount] 解析在线用户数失败:", error);
    }
  };

  /**
   * 处理游客在线人数消息
   */
  const handleVisitorCountMessage = (message: any) => {
    try {
      const data = message.body;
      const jsonData = JSON.parse(data) as OnlineCountMessage;
      const count = typeof jsonData === "number" ? jsonData : jsonData.count;

      if (count !== undefined && !isNaN(count)) {
        visitorCount.value = count;
      } else {
        console.warn("[useOnlineCount] 收到无效的游客在线数:", data);
      }
    } catch (error) {
      console.error("[useOnlineCount] 解析游客在线数失败:", error);
    }
  };

  /**
   * 订阅在线用户计数主题
   */
  const subscribeToOnlineCount = () => {
    const topic = getTopic();
    if (onlineCountSubscriptionId) {
      stomp.unsubscribe(onlineCountSubscriptionId);
      onlineCountSubscriptionId = null;
    }

    onlineCountSubscriptionId = stomp.subscribe(topic, handleOnlineCountMessage);
  };

  /**
   * 订阅游客在线人数主题
   */
  const subscribeToVisitorCount = () => {
    if (visitorCountSubscriptionId) {
      stomp.unsubscribe(visitorCountSubscriptionId);
      visitorCountSubscriptionId = null;
    }

    visitorCountSubscriptionId = stomp.subscribe(getVisitorTopic(), handleVisitorCountMessage);
  };

  /**
   * 计算前台模式下展示的总在线人数
   */
  const totalOnlineCount = computed(() => onlineUserCount.value + visitorCount.value);

  /**
   * 计算当前模式下应展示的人数
   */
  const displayOnlineCount = computed(() => {
    return mode.value === "blog" ? totalOnlineCount.value : onlineUserCount.value;
  });

  /**
   * 切换在线人数模式
   */
  const setMode = (nextMode: OnlineCountMode) => {
    if (mode.value === nextMode) {
      return;
    }

    mode.value = nextMode;

    if (!stomp.isConnected.value) {
      return;
    }

    if (nextMode === "blog") {
      subscribeToVisitorCount();
      subscribeToOnlineCount();
    } else {
      if (visitorCountSubscriptionId) {
        stomp.unsubscribe(visitorCountSubscriptionId);
        visitorCountSubscriptionId = null;
      }
      subscribeToOnlineCount();
    }
  };

  const isBlogMode = (nextMode: OnlineCountMode) => nextMode === "blog";

  /**
   * 初始化 WebSocket 连接并订阅在线用户主题
   */
  const initialize = (nextMode: OnlineCountMode = mode.value) => {
    setMode(nextMode);

    // 检查 WebSocket 端点是否配置
    const wsEndpoint = import.meta.env.VITE_APP_WS_ENDPOINT;
    if (!wsEndpoint) {
      console.log("[useOnlineCount] 未配置 WebSocket 端点，跳过初始化");
      return;
    }

    // 游客模式不需要 token，前台游客人数单独订阅游客主题
    if (isBlogMode(nextMode)) {
      stomp.connect();
      subscribeToVisitorCount();
      return;
    }

    // 检查令牌有效性
    const accessToken = AuthStorage.getAccessToken();
    if (!accessToken) {
      console.log("[useOnlineCount] 未检测到有效令牌，跳过初始化");
      return;
    }

    // 建立 WebSocket 连接
    stomp.connect();

    // 订阅主题
    subscribeToOnlineCount();
  };

  /**
   * 关闭 WebSocket 连接并清理资源
   */
  const cleanup = () => {
    // 取消订阅
    if (onlineCountSubscriptionId) {
      stomp.unsubscribe(onlineCountSubscriptionId);
      onlineCountSubscriptionId = null;
    }
    if (visitorCountSubscriptionId) {
      stomp.unsubscribe(visitorCountSubscriptionId);
      visitorCountSubscriptionId = null;
    }

    // 断开连接
    stomp.disconnect();

    // 重置状态
    onlineUserCount.value = 0;
    visitorCount.value = 0;
    lastUpdateTime.value = 0;
  };

  const currentTopic = computed(() => getTopic());

  const visibleOnlineCount = computed(() => {
    if (mode.value === "blog") {
      return `${onlineUserCount.value} 人（游客：${visitorCount.value} 人）`;
    }
    return `${onlineUserCount.value} 人`;
  });

  return {
    // 状态
    onlineUserCount: readonly(onlineUserCount),
    visitorCount: readonly(visitorCount),
    totalCount: readonly(totalCount),
    displayOnlineCount: readonly(displayOnlineCount),
    visibleOnlineCount: readonly(visibleOnlineCount),
    lastUpdateTime: readonly(lastUpdateTime),
    mode: readonly(mode),
    currentTopic: readonly(currentTopic),
    isConnected: stomp.isConnected,
    connectionState: stomp.connectionState,

    // 方法
    initialize,
    cleanup,
    setMode,
  };
}

/**
 * 在线用户计数组合式函数（单例模式）
 *
 * 用于实时显示系统在线用户数量
 *
 * @example
 * ```ts
 * // 在组件中使用（推荐）
 * const { onlineUserCount, isConnected } = useOnlineCount();
 *
 * // 手动控制初始化（高级用法）
 * const { onlineUserCount, initialize, cleanup } = useOnlineCount({ autoInit: false });
 * onMounted(() => initialize());
 * onUnmounted(() => cleanup());
 * ```
 */
export function useOnlineCount(options: { autoInit?: boolean } = {}) {
  const { autoInit = true } = options;

  // 获取或创建单例实例
  if (!globalInstance) {
    globalInstance = createOnlineCountComposable();
  }

  // 组件级自动初始化（仅在组件上下文中生效）
  const instance = getCurrentInstance();
  if (autoInit && instance) {
    onMounted(() => {
      // 防止重复初始化：只有在未连接时才尝试初始化
      if (!globalInstance!.isConnected.value) {
        globalInstance!.initialize();
      }
    });

    // 注意：组件卸载时不关闭连接，保持全局连接
    onUnmounted(() => {
      // 全局连接由 cleanupWebSocket() 统一管理
    });
  }

  return globalInstance;
}
