/**
 * 通知中心逻辑
 */
import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";
import type { NoticeItem, NoticeDetail, NoticeQueryParams } from "@/types/api";
import NoticeAPI from "@/api/system/notice";
import { useStomp } from "@/composables";
import router from "@/router";

const PAGE_SIZE = 5;

export function useNotice(dropdownRef?: Ref<any>) {
  const { subscribe, unsubscribe, isConnected } = useStomp();

  // 状态
  const list = ref<NoticeItem[]>([]);
  const unreadTotal = ref(0);
  const detail = ref<NoticeDetail | null>(null);
  const dialogVisible = ref(false);

  let subscribed = false;

  // ============================================
  // 数据获取
  // ============================================

  async function fetchList(params?: Partial<NoticeQueryParams>) {
    const query: NoticeQueryParams = {
      pageNum: 1,
      pageSize: PAGE_SIZE,
      ...params,
    };
    const page = await NoticeAPI.getMyNoticePage(query);
    const rows = page.rows || [];
    list.value = rows.filter((item: NoticeItem) => item.isRead === "0");
    unreadTotal.value = list.value.length;
  }

  async function read(id: string) {
    detail.value = await NoticeAPI.getDetail(id);
    dialogVisible.value = true;

    // 从列表中移除已读项
    list.value = list.value.filter((item: NoticeItem) => item.id !== id);
    if (unreadTotal.value > 0) unreadTotal.value -= 1;

    await fetchList();
    window.dispatchEvent(new CustomEvent("notice-read-updated", { detail: { id } }));
  }

  async function readAll() {
    await NoticeAPI.readAll();
    list.value = [];
    unreadTotal.value = 0;
    ElMessage.success("已全部标记为已读");
  }

  function goMore() {
    dropdownRef?.value?.handleClose?.();
    router.push({ name: "MyNotice" });
  }

  // ============================================
  // WebSocket 订阅
  // ============================================

  function setupSubscription() {
    if (subscribed || !isConnected.value) return;

    subscribe("/user/queue/message", (message: any) => {
      try {
        const data = JSON.parse(message.body || "{}");
        if (!data.id) return;

        // 避免重复
        if (list.value.some((item: NoticeItem) => item.id === data.id)) return;

        if (data.isRead === "1") return;

        unreadTotal.value += 1;

        list.value.unshift({
          id: data.id,
          title: data.title,
          type: data.type,
          publishTime: data.publishTime,
          isRead: "0",
        } as NoticeItem);

        if (list.value.length > PAGE_SIZE) {
          list.value.length = PAGE_SIZE;
        }

        ElNotification({
          title: "您收到一条新的通知消息！",
          message: data.title,
          type: "success",
          position: "bottom-right",
        });
      } catch (e) {
        console.error("解析通知消息失败", e);
      }
    });

    subscribed = true;
  }

  // ============================================
  // 生命周期
  // ============================================

  onMounted(() => {
    fetchList();
    setupSubscription();
  });

  onBeforeUnmount(() => {
    unsubscribe("/user/queue/message");
    subscribed = false;
  });

  return {
    list,
    unreadTotal,
    detail,
    dialogVisible,
    fetchList,
    read,
    readAll,
    goMore,
  };
}
