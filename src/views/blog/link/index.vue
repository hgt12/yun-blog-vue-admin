<!-- 友链管理 -->
<template>
  <div class="app-container">
    <div class="filter-section">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="站点名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px">
            <el-option label="启用" value="0" />
            <el-option label="弃用" value="1" />
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
          <el-button type="success" icon="plus" @click="handleCreateClick">新增</el-button>
          <el-button
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
        :data="linkList"
        border
        highlight-current-row
        class="table-section__content"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="站点名称" prop="name" min-width="130" />
        <el-table-column label="站点地址" prop="address" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link :href="row.address" target="_blank" type="primary">{{ row.address }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" min-width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'info'">
              {{ row.status === "0" ? "启用" : "弃用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="80" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="170" align="center" />
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleEditClick(row.id)"
            >
              编辑
            </el-button>
            <el-button type="danger" size="small" link icon="delete" @click="handleDelete(row.id)">
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

    <!-- 表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="550px" @close="closeDialog">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
        <el-form-item label="站点名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入站点名称" />
        </el-form-item>
        <el-form-item label="站点地址" prop="address">
          <el-input
            v-model="formData.address"
            placeholder="请输入站点地址，如 https://example.com"
          />
        </el-form-item>
        <el-form-item label="站点 Logo" prop="logo">
          <el-input v-model="formData.logo" placeholder="请输入 Logo 图片地址（选填）" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="2"
            placeholder="请输入站点描述（选填）"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="0">启用</el-radio>
            <el-radio value="1">弃用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            controls-position="right"
            style="width: 120px"
          />
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
import BlogLinkAPI from "@/api/blog/link";
import type { BlogLinkItem, BlogLinkForm, BlogLinkQueryParams } from "@/types/api";

defineOptions({ name: "BlogLink", inheritAttrs: false });

const queryFormRef = ref();
const formRef = ref();
const loading = ref(false);
const submitting = ref(false);
const total = ref(0);
const selectIds = ref<string[]>([]);
const linkList = ref<BlogLinkItem[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");

const queryParams = reactive<BlogLinkQueryParams>({ pageNum: 1, pageSize: 10 });
const formData = reactive<BlogLinkForm>({ name: "", address: "", status: "0", sort: 0 });

const rules = {
  name: [{ required: true, message: "请输入站点名称", trigger: "blur" }],
  address: [{ required: true, message: "请输入站点地址", trigger: "blur" }],
};

async function fetchList() {
  loading.value = true;
  try {
    const data = await BlogLinkAPI.getPage(queryParams);
    linkList.value = data.rows;
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
function handleSelectionChange(selection: BlogLinkItem[]) {
  selectIds.value = selection.map((i) => i.id!).filter(Boolean);
}

function handleCreateClick() {
  dialogTitle.value = "新增友链";
  Object.assign(formData, {
    id: undefined,
    name: "",
    address: "",
    logo: "",
    description: "",
    status: "0",
    sort: 0,
  });
  dialogVisible.value = true;
}

async function handleEditClick(id: string) {
  dialogTitle.value = "编辑友链";
  const data = await BlogLinkAPI.getFormData(id);
  Object.assign(formData, data);
  dialogVisible.value = true;
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  submitting.value = true;
  try {
    if (formData.id) {
      await BlogLinkAPI.update(formData.id, formData);
      ElMessage.success("修改成功");
    } else {
      await BlogLinkAPI.create(formData);
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
    BlogLinkAPI.deleteByIds(ids)
      .then(() => {
        ElMessage.success("删除成功");
        handleResetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

onMounted(() => handleQuery());
</script>
