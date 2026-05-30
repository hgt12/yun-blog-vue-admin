<template>
  <el-dropdown ref="dropdownRef" class="notice__dropdown" trigger="click">
    <div class="notice__trigger">
      <el-badge v-if="unreadTotal > 0" :value="unreadTotal" :max="99">
        <div class="i-svg:bell" />
      </el-badge>

      <div v-else class="i-svg:bell" />
    </div>

    <template #dropdown>
      <div class="notice-dropdown__panel">
        <div class="notice-dropdown__header">
          <div>
            <div class="notice-dropdown__title">通知消息</div>
          </div>
          <div class="notice-dropdown__sub">{{ unreadTotal }} 条未读</div>
        </div>

        <template v-if="list.length > 0">
          <div class="notice-dropdown__list">
            <div
              v-for="item in list"
              :key="item.id"
              class="notice-dropdown__item"
              @click="read(item.id)"
            >
              <div class="notice-dropdown__content">
                <div class="notice-dropdown__row">
                  <div class="notice-dropdown__title-wrap">
                    <DictTag v-model="item.type" code="notice_type" size="small" />
                    <el-text class="notice-dropdown__name" truncated>
                      {{ item.title }}
                    </el-text>
                  </div>
                  <div class="notice-dropdown__right">
                    <div class="notice-dropdown__time">{{ item.publishTime }}</div>
                    <el-icon class="notice-dropdown__arrow">
                      <ArrowRight />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="notice-dropdown__footer">
            <el-link type="primary" underline="never" @click="goMore">
              <span class="text-xs">查看更多</span>
              <el-icon class="text-xs">
                <ArrowRight />
              </el-icon>
            </el-link>
            <el-link v-if="list.length > 0" type="primary" underline="never" @click="readAll">
              <span class="text-xs">全部已读</span>
            </el-link>
          </div>
        </template>
        <template v-else>
          <div class="notice-dropdown__empty">
            <el-empty :image-size="50" description="暂无消息" />
          </div>
        </template>
      </div>
    </template>
  </el-dropdown>

  <NoticeDetailDialog v-model="dialogVisible" :notice="detail" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useNotice } from "./useNotice";
import NoticeDetailDialog from "@/components/NoticeDetailDialog/index.vue";

const dropdownRef = ref();
const { list, unreadTotal, detail, dialogVisible, read, readAll, goMore } = useNotice(dropdownRef);
</script>

<style lang="scss" scoped>
.notice {
  &__dropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}

.notice-dropdown {
  &__panel {
    width: 420px;
    padding: 14px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, #fff 100%);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 14px;
    box-shadow: 0 16px 40px rgb(15 23 42 / 12%);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 6px 14px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__sub {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__list {
    max-height: 360px;
    margin-top: 10px;
    overflow-y: auto;
  }

  &__item {
    padding: 12px 10px;
    margin-bottom: 8px;
    cursor: pointer;
    background: #f8fafc;
    border: 1px solid transparent;
    border-radius: 12px;
    transition: all 0.2s ease;

    &:hover {
      background: #eef4ff;
      border-color: #c7d7fe;
      box-shadow: 0 10px 20px rgb(37 99 235 / 8%);
      transform: translateY(-1px);
    }
  }

  &__content {
    width: 100%;
  }

  &__row {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
  }

  &__title-wrap {
    display: flex;
    flex: 1;
    gap: 10px;
    align-items: center;
    min-width: 0;
  }

  &__right {
    display: flex;
    flex-shrink: 0;
    gap: 10px;
    align-items: center;
  }

  &__name {
    display: block;
    min-width: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  &__time {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    white-space: nowrap;
  }

  &__arrow {
    color: var(--el-text-color-placeholder);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 6px 4px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 180px;
  }
}
</style>
