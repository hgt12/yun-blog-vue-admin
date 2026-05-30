<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="filter-section">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="通知标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="关键字"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item class="search-buttons">
          <el-button type="primary" @click="handleQuery">
            <template #icon>
              <Search />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon>
              <Refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="hover" class="table-section">
      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        border
        highlight-current-row
        class="table-section__content"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="通知标题" prop="title" min-width="200" />
        <el-table-column align="center" label="通知类型" width="150">
          <template #default="scope">
            <DictTag v-model="scope.row.type" code="notice_type" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="通知等级" width="100">
          <template #default="scope">
            <DictTag v-model="scope.row.level" code="notice_level" />
          </template>
        </el-table-column>
        <el-table-column
          key="releaseTime"
          align="center"
          label="发布时间"
          prop="publishTime"
          width="150"
        />
        <el-table-column align="center" label="发布人" prop="publisherName" width="150" />
        <el-table-column align="center" label="状态" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.isRead == 1" type="success">已读</el-tag>
            <el-tag v-else type="info">未读</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="80">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              icon="View"
              @click="handleReadNotice(scope.row.id)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <el-dialog
      v-model="noticeDialogVisible"
      :title="noticeDetail?.title ?? '通知详情'"
      width="800px"
      custom-class="notice-detail"
    >
      <div v-if="noticeDetail" class="notice-detail__wrapper">
        <div class="notice-detail__meta">
          <span>
            <el-icon><User /></el-icon>
            {{ noticeDetail.publisherName }}
          </span>
          <span>
            <el-icon><Timer /></el-icon>
            {{ noticeDetail.publishTime }}
          </span>
        </div>

        <div class="notice-detail__content">
          <div v-html="noticeDetail.content"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "MyNotice",
  inheritAttrs: false,
});

import { onMounted, onBeforeUnmount, reactive, ref } from "vue";
import { Timer } from "@element-plus/icons-vue";
import NoticeAPI from "@/api/system/notice";
import type { NoticeDetail, NoticeItem, NoticeQueryParams } from "@/types/api";

const queryFormRef = ref();
const pageData = ref<NoticeItem[]>([]);
const loading = ref(false);
const total = ref(0);

const queryParams = reactive<NoticeQueryParams>({
  pageNum: 1,
  pageSize: 10,
});

const noticeDialogVisible = ref(false);
const noticeDetail = ref<NoticeDetail | null>(null);

async function handleQuery() {
  loading.value = true;
  try {
    const data = await NoticeAPI.getMyNoticePage(queryParams);
    pageData.value = data.rows;
    total.value = data.total ?? 0;
  } finally {
    loading.value = false;
  }
}

function handleResetQuery() {
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

async function handleReadNotice(id: string) {
  const data = await NoticeAPI.getDetail(id);
  noticeDetail.value = data;
  noticeDialogVisible.value = true;
  await handleQuery();
}

function handleNoticeReadUpdated() {
  handleQuery();
}

onMounted(() => {
  handleQuery();
  window.addEventListener("notice-read-updated", handleNoticeReadUpdated as EventListener);
});

onBeforeUnmount(() => {
  window.removeEventListener("notice-read-updated", handleNoticeReadUpdated as EventListener);
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  padding-bottom: 14px;
  text-align: center;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-dialog__body) {
  padding-top: 0;
}

.notice-detail {
  &__wrapper {
    padding: 6px 20px 20px;
  }

  &__banner {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 16px 18px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
    border: 1px solid #dbeafe;
    border-radius: 16px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    font-size: 20px;
    color: #2563eb;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 8px 20px rgb(37 99 235 / 12%);
  }

  &__banner-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__banner-sub {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    align-items: center;
    padding: 12px 14px;
    margin-bottom: 16px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
    background: #f8fafc;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;

    span {
      display: inline-flex;
      gap: 6px;
      align-items: center;
    }
  }

  &__content {
    max-height: 60vh;
    padding: 18px 18px 20px;
    overflow-y: auto;
    line-height: 1.8;
    color: var(--el-text-color-primary);
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 14px;
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 60%);

    :deep(img) {
      max-width: 100%;
      height: auto;
    }

    :deep(p) {
      margin: 0 0 12px;
    }

    :deep(blockquote) {
      padding: 12px 16px;
      margin: 12px 0;
      color: var(--el-text-color-secondary);
      background: #f8fafc;
      border-left: 4px solid #cbd5e1;
      border-radius: 8px;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }
  }
}
</style>
