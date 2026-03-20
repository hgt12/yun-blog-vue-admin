<!-- 博客分类管理 -->
<template>
  <div class="app-container">
    <div class="filter-section">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="queryParams.keywords" placeholder="分类名称" clearable @keyup.enter="handleQuery" />
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
          <el-button type="success" icon="plus" @click="handleCreateClick">新增</el-button>
          <el-button type="danger" :disabled="selectIds.length === 0" icon="delete" @click="handleDelete()">删除</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="categoryList" border highlight-current-row class="table-section__content" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="分类名称" prop="name" min-width="150" />
        <el-table-column label="文章数量" prop="postCount" width="120" align="center" />
        <el-table-column label="排序" prop="sort" width="100" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="170" align="center" />
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link icon="edit" @click="handleEditClick(row.id)">编辑</el-button>
            <el-button type="danger" size="small" link icon="delete" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="fetchList" />
    </el-card>

    <!-- 表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="closeDialog">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" controls-position="right" style="width: 120px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import BlogCategoryAPI from "@/api/blog/category";
import type { BlogCategoryItem, BlogCategoryForm, BlogCategoryQueryParams } from "@/types/api";

defineOptions({ name: "BlogCategory", inheritAttrs: false });

const queryFormRef = ref();
const formRef = ref();
const loading = ref(false);
const submitting = ref(false);
const total = ref(0);
const selectIds = ref<string[]>([]);
const categoryList = ref<BlogCategoryItem[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");

const queryParams = reactive<BlogCategoryQueryParams>({ pageNum: 1, pageSize: 10 });
const formData = reactive<BlogCategoryForm>({ sort: 1 });

const rules = {
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
};

async function fetchList() {
  loading.value = true;
  try {
    const data = await BlogCategoryAPI.getPage(queryParams);
    categoryList.value = data.list;
    total.value = data.total ?? 0;
  } finally {
    loading.value = false;
  }
}

function handleQuery() { queryParams.pageNum = 1; fetchList(); }
function handleResetQuery() { queryFormRef.value?.resetFields(); handleQuery(); }
function handleSelectionChange(selection: BlogCategoryItem[]) { selectIds.value = selection.map((i) => i.id!).filter(Boolean); }

function handleCreateClick() {
  dialogTitle.value = "新增分类";
  formData.id = undefined;
  formData.name = "";
  formData.sort = 1;
  dialogVisible.value = true;
}

async function handleEditClick(id: string) {
  dialogTitle.value = "编辑分类";
  const data = await BlogCategoryAPI.getFormData(id);
  Object.assign(formData, data);
  dialogVisible.value = true;
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  submitting.value = true;
  try {
    if (formData.id) {
      await BlogCategoryAPI.update(formData.id, formData);
      ElMessage.success("修改成功");
    } else {
      await BlogCategoryAPI.create(formData);
      ElMessage.success("新增成功");
    }
    closeDialog();
    handleResetQuery();
  } finally {
    submitting.value = false;
  }
}

function closeDialog() {
  dialogVisible.value = false;
  formRef.value?.resetFields();
}

function handleDelete(id?: string) {
  const ids = id ?? selectIds.value.join(",");
  if (!ids) { ElMessage.warning("请勾选删除项"); return; }
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }).then(() => {
    loading.value = true;
    BlogCategoryAPI.deleteByIds(ids).then(() => {
      ElMessage.success("删除成功");
      handleResetQuery();
    }).finally(() => (loading.value = false));
  });
}

onMounted(() => handleQuery());
</script>
