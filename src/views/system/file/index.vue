<template>
  <div class="app-container">
    <div class="filter-section">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="文件名或文件来源"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item class="search-buttons">
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="hover" class="table-section">
      <div class="table-section__toolbar">
        <div class="table-section__toolbar--actions">
          <el-upload :show-file-list="false" :http-request="handleUpload">
            <el-button v-hasPerm="['sys:file:upload']" type="success" icon="upload">
              上传文件
            </el-button>
          </el-upload>
          <el-button
            v-hasPerm="['sys:file:delete']"
            type="danger"
            :disabled="!selectIds.length"
            icon="delete"
            @click="handleDelete()"
          >
            删除
          </el-button>
        </div>
      </div>

      <el-progress
        v-if="uploadProgress > 0 && uploadProgress < 100"
        :percentage="uploadProgress"
        :stroke-width="8"
        class="mb-3"
      />

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        border
        class="table-section__content"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column label="缩略图" align="center" width="100">
          <template #default="scope">
            <el-image
              v-if="isImage(scope.row.mimeType)"
              :src="scope.row.url"
              fit="cover"
              class="file-thumb"
              :preview-src-list="[scope.row.url]"
              preview-teleported
            />
            <div v-else class="file-thumb file-thumb--placeholder">暂无缩略图</div>
          </template>
        </el-table-column>
        <el-table-column label="文件名" prop="name" min-width="180" />
        <el-table-column label="Mime-Type" align="center" prop="mimeType" width="120" />
        <el-table-column label="文件来源" align="center" prop="fileSource" width="120" />
        <el-table-column label="大小" align="center" prop="size" width="120">
          <template #default="scope">{{ formatSize(scope.row.size) }}</template>
        </el-table-column>
        <el-table-column label="创建者" align="center" prop="createBy" width="120" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180" />
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template #default="scope">
            <el-button
              v-hasPerm="['sys:file:preview']"
              link
              type="primary"
              size="small"
              icon="View"
              @click.stop="handlePreview(scope.row)"
            >
              预览
            </el-button>
            <el-button
              v-hasPerm="['sys:file:download']"
              link
              type="success"
              size="small"
              icon="download"
              @click.stop="handleDownload(scope.row)"
            >
              下载
            </el-button>
            <el-button
              v-hasPerm="['sys:file:delete']"
              link
              type="danger"
              size="small"
              icon="delete"
              @click.stop="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="fetchData"
      />
    </el-card>

    <el-drawer v-model="drawerVisible" title="文件详情" size="520px">
      <div v-if="currentFile">
        <el-image
          v-if="isImage(currentFile.mimeType)"
          :src="currentFile.url"
          fit="contain"
          style="width: 100%"
        />
        <el-descriptions :column="1" border class="mt-4">
          <el-descriptions-item label="文件名">
            <span class="break-all">{{ currentFile.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="Mime-type">{{ currentFile.mimeType }}</el-descriptions-item>
          <el-descriptions-item label="文件大小">
            {{ formatSize(currentFile.size) }}
          </el-descriptions-item>
          <el-descriptions-item label="存储路径">
            <span class="break-all">{{ currentFile.filePath }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentFile.createTime }}</el-descriptions-item>
        </el-descriptions>
        <div class="dialog-footer mt-4">
          <el-button
            v-hasPerm="['sys:file:copy_link']"
            type="primary"
            @click="handleCopy(currentFile)"
          >
            复制链接
          </el-button>
          <el-button
            v-hasPerm="['sys:file:download']"
            type="success"
            @click="handleDownload(currentFile)"
          >
            下载
          </el-button>
          <el-button
            v-hasPerm="['sys:file:delete']"
            type="danger"
            @click="handleDelete(currentFile?.id)"
          >
            删除
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "SysFile", inheritAttrs: false });

import FileAPI from "@/api/file";
import type { FileItem, FileQueryParams } from "@/types/api";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";

const queryFormRef = ref<FormInstance>();
const queryParams = reactive<FileQueryParams>({
  pageNum: 1,
  pageSize: 10,
  keywords: "",
  fileSource: "",
});
const pageData = ref<FileItem[]>([]);
const total = ref(0);
const loading = ref(false);
const selectIds = ref<string[]>([]);
const uploadProgress = ref(0);
const drawerVisible = ref(false);
const currentFile = ref<FileItem | null>(null);

function fetchData(): void {
  loading.value = true;
  FileAPI.getList(queryParams)
    .then((data) => {
      pageData.value = data.rows || [];
      total.value = data.total || 0;
    })
    .finally(() => {
      loading.value = false;
    });
}

function handleQuery(): void {
  queryParams.pageNum = 1;
  fetchData();
}

function handleResetQuery(): void {
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  fetchData();
}

function handleSelectionChange(selection: FileItem[]): void {
  selectIds.value = selection.map((item) => item.id).filter(Boolean);
}

function handleRowClick(row: FileItem): void {
  currentFile.value = row;
  drawerVisible.value = true;
}

async function handleUpload(option: any): Promise<unknown> {
  uploadProgress.value = 0;
  const formData = new FormData();
  formData.append("file", option.file);
  return FileAPI.upload(formData, (percent) => {
    uploadProgress.value = percent;
  })
    .then(() => {
      uploadProgress.value = 100;
      ElMessage.success("上传成功");
      fetchData();
      window.setTimeout(() => {
        uploadProgress.value = 0;
      }, 800);
    })
    .catch(() => {
      uploadProgress.value = 0;
      ElMessage.error("上传失败");
    });
}

function handlePreview(file: FileItem): void {
  currentFile.value = file;
  drawerVisible.value = true;
}

async function handleCopy(file: FileItem): Promise<void> {
  try {
    await navigator.clipboard.writeText(file.url);
    ElMessage.success("已复制链接");
  } catch {
    ElMessage.error("复制失败");
  }
}

function handleDownload(file: FileItem): void {
  console.log("file.name =", file.name);
  FileAPI.download(file.url, file.name);
}

function handleDelete(id?: string): void {
  const ids = id ?? selectIds.value.join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除该文件吗？", "警告", { type: "warning" }).then(() => {
    loading.value = true;
    FileAPI.deleteByIds(ids)
      .then(() => {
        ElMessage.success("删除成功");
        fetchData();
      })
      .finally(() => (loading.value = false));
  });
}

function isImage(mimeType?: string): boolean {
  return !!mimeType?.startsWith("image/");
}

function formatSize(size?: number): string {
  if (!size) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.file-thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  overflow: hidden;
  background: var(--el-fill-color-light);
  border-radius: 6px;
}

.file-thumb--placeholder {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.break-all {
  word-break: break-all;
  white-space: normal;
}
</style>
