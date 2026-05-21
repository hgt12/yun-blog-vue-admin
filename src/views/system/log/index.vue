<template>
  <div class="app-container">
    <div class="filter-section">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="auto">
        <el-form-item prop="keywords" label="关键字">
          <el-input
            v-model="queryParams.keywords"
            placeholder="操作人或页面标题"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item prop="visitTime" label="访问时间">
          <el-date-picker
            v-model="queryParams.visitTime"
            :editable="false"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="YYYY-MM-DD"
            style="width: 260px"
          />
        </el-form-item>

        <el-form-item class="search-buttons">
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="hover" class="data-table">
      <div class="data-table__toolbar">
        <div class="data-table__toolbar--right">
          <el-button v-hasPerm="['system:log:export']" icon="download" @click="handleExport">
            导出
          </el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
        class="data-table__content"
      >
        <el-table-column label="操作人" prop="operator" width="120" align="center" />
        <el-table-column label="访问时间" prop="visitTime" width="220" align="center" />
        <el-table-column label="页面标题" prop="pageTitle" width="100" align="center" />
        <el-table-column label="页面地址" prop="pageUrl" min-width="100" align="center" />
        <el-table-column label="页面前地址" prop="referrer" min-width="100" align="center" />
        <el-table-column label="IP 地址" prop="ip" width="150" align="center" />
        <el-table-column label="地区信息" prop="region" width="150" align="center" />
        <el-table-column label="浏览器" prop="browser" width="150" align="center" />
        <el-table-column
          label="终端系统"
          prop="os"
          width="150"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="执行时间(ms)" prop="executionTime" width="120" align="center" />
      </el-table>

      <div class="data-table__pagination">
        <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="fetchData"
        />
      </div>
    </el-card>

    <el-dialog v-model="exportDialogVisible" title="请选择导出方式" width="420px" append-to-body>
      <div style="padding: 10px 0">
        <div style="font-size: 14px; line-height: 1.8; color: #606266">
          <p style="margin: 0 0 8px 0">导出当前页：{{ pageData?.length || 0 }} 条日志数据</p>
          <p style="margin: 0">导出全部：{{ total }} 条日志数据</p>
        </div>
      </div>
      <template #footer>
        <div style="display: flex; gap: 12px; justify-content: center">
          <el-button type="success" @click="handleConfirmExport(false)">导出全部</el-button>
          <el-button type="primary" @click="handleConfirmExport(true)">导出当前页</el-button>
          <el-button @click="exportDialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Log",
  inheritAttrs: false,
});

import LogAPI from "@/api/system/log";
import { downloadFile } from "@/utils/download";
import type { LogItem, LogQueryParams } from "@/types/api";
import type { FormInstance } from "element-plus";

// 表单引用
const queryFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<LogQueryParams>({
  pageNum: 1,
  pageSize: 10,
  keywords: "",
  visitTime: undefined as [string, string] | undefined,
});

// 列表数据
const pageData = ref<LogItem[]>();
const total = ref(0);
const loading = ref(false);
const exportDialogVisible = ref(false);

/**
 * 加载日志列表数据
 */
function fetchData(): void {
  loading.value = true;
  LogAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.rows;
      total.value = data.total ?? 0;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 查询按钮点击事件
 */
function handleQuery(): void {
  queryParams.pageNum = 1;
  fetchData();
}

/**
 * 重置查询
 */
function handleResetQuery(): void {
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  queryParams.visitTime = undefined;
  fetchData();
}

/**
 * 导出日志
 */
function handleExport(): void {
  exportDialogVisible.value = true;
}

function handleConfirmExport(isCurrentPage: boolean): void {
  const exportType = isCurrentPage ? "当前页" : "全部";
  const exportCount = isCurrentPage ? pageData.value?.length || 0 : total.value;
  exportDialogVisible.value = false;

  ElMessageBox.confirm(`确认导出${exportType} ${exportCount} 条日志数据？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      loading.value = true;
      const exportParams: Partial<LogQueryParams> = { ...queryParams };

      if (!isCurrentPage) {
        exportParams.pageNum = undefined;
        exportParams.pageSize = undefined;
      }

      LogAPI.export(exportParams)
        .then((response) => {
          downloadFile(response);
          ElMessage.success(`${exportType}数据导出成功`);
        })
        .catch(() => {
          ElMessage.error("导出失败，请重试");
        })
        .finally(() => {
          loading.value = false;
        });
    })
    .catch(() => {
      // 取消导出
    });
}

onMounted(() => {
  handleQuery();
});
</script>

<style scoped lang="scss">
.data-table {
  &__toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  &__toolbar--right {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  &__pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
