<!-- 博客文章列表 -->
<template>
  <div class="app-container">
    <div class="filter-section">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="文章标题或摘要"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select-v2
            v-model="queryParams.categoryId"
            :options="categoryOptions"
            placeholder="全部"
            filterable
            clearable
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="标签" prop="tagId">
          <el-select-v2
            v-model="queryParams.tagId"
            :options="tagOptions"
            placeholder="全部"
            filterable
            clearable
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px">
            <el-option label="已发布" :value="0" />
            <el-option label="草稿" :value="1" />
          </el-select>
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
          <el-button
            v-hasPerm="['blog:post:create']"
            type="success"
            icon="plus"
            @click="handleWrite()"
          >
            写博客
          </el-button>
          <el-button
            v-hasPerm="['blog:post:delete']"
            type="danger"
            :disabled="selectIds.length === 0"
            icon="delete"
            @click="handleDelete()"
          >
            删除
          </el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="postList"
        border
        highlight-current-row
        class="table-section__content"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="文章标题" prop="title" min-width="200" show-overflow-tooltip />
        <el-table-column label="摘要" prop="summary" min-width="250" show-overflow-tooltip />
        <el-table-column label="分类" prop="categoryName" width="180" align="center">
          <template #default="{ row }">
            <div>
              <div>{{ row.categoryName }}</div>
              <div v-if="row.categoryStatus == 1" style="font-size: 12px; color: #e6a23c">
                (使用已禁用的分类)
              </div>
              <div v-if="row.categoryStatus == 1" style="font-size: 12px; color: #e6a23c">
                (该文章将无法在前台显示)
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签" prop="tags" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags || []"
              :key="tag.id"
              size="small"
              class="mr-1"
              :type="tag.status === '1' ? 'info' : undefined"
              :effect="tag.status === '1' ? 'plain' : 'light'"
            >
              {{ tag.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'info'">
              {{ row.status === "0" ? "已发布" : "草稿" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="浏览量" prop="viewCount" width="90" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="170" align="center" />
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button
              v-hasPerm="['blog:post:update']"
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleWrite(row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPerm="['blog:post:delete']"
              type="danger"
              size="small"
              link
              icon="delete"
              @click="handleDelete(row.id)"
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
        @pagination="fetchList"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BlogPostAPI from "@/api/blog/post";
import BlogCategoryAPI from "@/api/blog/category";
import BlogTagAPI from "@/api/blog/tag";
import type { BlogPostItem, BlogPostQueryParams } from "@/types/api";

defineOptions({ name: "BlogPost", inheritAttrs: false });

const router = useRouter();
const queryFormRef = ref();
const loading = ref(false);
const total = ref(0);
const selectIds = ref<string[]>([]);
const postList = ref<BlogPostItem[]>([]);
const categoryOptions = ref<OptionItem[]>([]);
const tagOptions = ref<OptionItem[]>([]);

const queryParams = reactive<BlogPostQueryParams>({ pageNum: 1, pageSize: 10 });

async function fetchList() {
  loading.value = true;
  try {
    const data = await BlogPostAPI.getPage(queryParams);
    postList.value = data.rows;
    total.value = data.total ?? 0;
  } finally {
    loading.value = false;
  }
}

function handleQuery() {
  queryParams.pageNum = 1;
  fetchList();
}

function handleResetQuery() {
  queryFormRef.value?.resetFields();
  handleQuery();
}

function handleSelectionChange(selection: BlogPostItem[]) {
  selectIds.value = selection.map((item) => item.id!).filter(Boolean);
}

function handleWrite(id?: string) {
  if (id) {
    // 编辑文章，带上 id 参数
    router.push({ path: "/blog/write", query: { id } });
  } else {
    // 新建文章，直接跳转到写博客页面
    router.push({ path: "/blog/write" });
  }
}

function handleDelete(id?: string) {
  const ids = id ?? selectIds.value.join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    BlogPostAPI.deleteByIds(ids)
      .then(() => {
        ElMessage.success("删除成功");
        handleResetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

onMounted(async () => {
  categoryOptions.value = await BlogCategoryAPI.getOptions();
  tagOptions.value = await BlogTagAPI.getOptions();
  handleQuery();
});

onActivated(() => {
  handleQuery();
});
</script>
