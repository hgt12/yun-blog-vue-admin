<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    width="60%"
    class="notice-detail-dialog"
    append-to-body
    @close="handleClose"
  >
    <template #header>
      <div class="notice-detail-dialog__header">
        <span class="notice-detail-dialog__title">{{ title }}</span>
        <el-button text @click="handleClose">
          <template #icon>
            <Close />
          </template>
        </el-button>
      </div>
    </template>

    <div class="notice-detail-dialog__body">
      <div class="notice-detail-dialog__meta">
        <span class="notice-detail-dialog__meta-item">
          <el-icon><User /></el-icon>
          <span>{{ notice.publisherName || "-" }}</span>
        </span>
        <span class="notice-detail-dialog__meta-item">
          <el-icon><Timer /></el-icon>
          <span>{{ notice.publishTime || "-" }}</span>
        </span>
      </div>

      <div class="notice-detail-dialog__content" v-html="renderedContent" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Close, Timer, User } from "@element-plus/icons-vue";
import type { NoticeDetail } from "@/types/api";

const visible = defineModel<boolean>({ default: false });

const props = withDefaults(
  defineProps<{
    title?: string;
    notice?: NoticeDetail | null;
  }>(),
  {
    title: "通知公告详情",
    notice: null,
  }
);

const renderedContent = computed(() => props.notice?.content ?? "");
const notice = computed(() => props.notice ?? ({} as NoticeDetail));

function handleClose(): void {
  visible.value = false;
}
</script>

<style scoped lang="scss">
.notice-detail-dialog {
  :deep(.el-dialog__header) {
    padding-bottom: 14px;
    margin-right: 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-dialog__body) {
    padding-top: 18px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    flex: 1;
    margin-left: auto;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    text-align: center;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    padding: 12px 16px;
    background: #fafafa;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 14px;
  }

  &__meta-item {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }

  &__content {
    min-height: 120px;
    padding: 18px 20px;
    overflow: auto;
    line-height: 1.8;
    color: var(--el-text-color-primary);
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 18px;

    :deep(img) {
      display: block;
      max-width: 100%;
      height: auto;
    }

    :deep(table) {
      display: block;
      width: 100%;
      overflow-x: auto;
    }

    :deep(pre) {
      padding: 12px;
      overflow-x: auto;
      background: var(--el-fill-color-light);
      border-radius: 6px;
    }

    :deep(code) {
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }
  }
}
</style>
