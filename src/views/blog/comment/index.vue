<!-- 评论管理 -->
<template>
  <div class="app-container">
    <!-- 搜索筛选 -->
    <div class="filter-section">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="评论内容"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="评论类型" prop="type">
          <el-select
            v-model="queryParams.type"
            placeholder="全部"
            clearable
            style="width: 130px"
            @change="handleTypeChange"
          >
            <el-option label="文章评论" value="0" />
            <el-option label="友链留言" value="1" />
            <el-option label="留言板" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="queryParams.type === '0'" label="所属文章" prop="articleId">
          <el-select
            v-model="queryParams.articleId"
            placeholder="全部文章"
            clearable
            filterable
            style="width: 240px"
            @focus="loadArticleList"
          >
            <el-option
              v-for="article in articleList"
              :key="article.id!"
              :label="article.title!"
              :value="article.id!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" value="0" />
            <el-option label="待审核" value="1" />
            <el-option label="审核未通过" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围" prop="dateRange">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item class="search-buttons">
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 评论列表 -->
    <el-card shadow="hover" class="table-section">
      <div class="table-section__toolbar">
        <div class="table-section__toolbar--actions">
          <el-button
            v-hasPerm="['blog:comment:approve']"
            type="success"
            icon="select"
            :disabled="selectIds.length === 0"
            @click="handleBatchApprove()"
          >
            允许发布
          </el-button>
          <el-button
            v-hasPerm="['blog:comment:approve']"
            type="warning"
            icon="close"
            :disabled="selectIds.length === 0"
            @click="handleBatchReject()"
          >
            拒绝发布
          </el-button>
          <el-button
            v-hasPerm="['blog:comment:delete']"
            type="danger"
            icon="delete"
            :disabled="selectIds.length === 0"
            @click="handleDelete()"
          >
            删除
          </el-button>
        </div>
        <div class="table-section__toolbar--right">
          <!-- 统计卡片 -->
          <div class="statistics-inline">
            <div class="statistic-card">
              <el-icon class="statistic-card__icon" :size="16">
                <ChatDotSquare />
              </el-icon>
              <div class="statistic-card__content">
                <div class="statistic-card__value">{{ statistics.total || 0 }}</div>
                <div class="statistic-card__label">评论总数</div>
              </div>
            </div>
            <div class="statistic-card">
              <el-icon class="statistic-card__icon" :size="16">
                <Clock />
              </el-icon>
              <div class="statistic-card__content">
                <div class="statistic-card__value">{{ statistics.pendingReview || 0 }}</div>
                <div class="statistic-card__label">待审核</div>
              </div>
            </div>
            <div class="statistic-card">
              <el-icon class="statistic-card__icon" :size="16">
                <Close />
              </el-icon>
              <div class="statistic-card__content">
                <div class="statistic-card__value">{{ statistics.rejected || 0 }}</div>
                <div class="statistic-card__label">审核未通过</div>
              </div>
            </div>
            <div class="statistic-card">
              <el-icon class="statistic-card__icon" :size="16">
                <Promotion />
              </el-icon>
              <div class="statistic-card__content">
                <div class="statistic-card__value">{{ statistics.todayCount || 0 }}</div>
                <div class="statistic-card__label">今日新增</div>
              </div>
            </div>
          </div>
          <el-button v-hasPerm="['blog:comment:export']" icon="download" @click="handleExport">
            导出
          </el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="commentList"
        border
        highlight-current-row
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        class="table-section__content"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="评论内容" prop="content" min-width="250" show-overflow-tooltip />
        <el-table-column label="评论者" prop="nickname" width="120" align="center" />
        <el-table-column label="类型" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getCommentTypeTag(row.type)">
              {{ getCommentTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="所属文章" prop="articleTitle" width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.type === '0'">{{ row.articleTitle || "-" }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="回复对象" width="120" align="center">
          <template #default="{ row }">
            <span v-if="row.replyToNickname">{{ row.replyToNickname }}</span>
            <span v-else style="color: #909399">无</span>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" prop="likeCount" width="90" align="center">
          <template #default="{ row }">
            {{ row.likeCount || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === '0'" type="success">正常</el-tag>
            <el-tag v-else-if="row.status === '1'" type="warning">待审核</el-tag>
            <el-tag v-else-if="row.status === '2'" type="danger">审核未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评论时间" prop="createTime" width="170" align="center" />
        <el-table-column fixed="right" label="操作" width="240" align="center">
          <template #default="{ row }">
            <el-button
              v-hasPerm="['blog:comment:view']"
              type="primary"
              size="small"
              link
              icon="view"
              @click="handleView(row)"
            >
              详情
            </el-button>
            <el-button
              v-if="row.status === '1'"
              v-hasPerm="['blog:comment:approve']"
              type="success"
              size="small"
              link
              icon="select"
              @click="handleOpenReviewDialog(row)"
            >
              审核
            </el-button>
            <el-button
              v-hasPerm="['blog:comment:reply']"
              type="warning"
              size="small"
              link
              icon="chat-dot-round"
              @click="handleReply(row)"
            >
              回复
            </el-button>
            <el-button
              v-hasPerm="['blog:comment:delete']"
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

    <!-- 评论详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="评论详情" width="700px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="评论内容" :span="2">
          <div style="white-space: pre-wrap">{{ currentComment.content }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="评论者昵称">
          {{ currentComment.nickname }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ currentComment.email }}
        </el-descriptions-item>
        <el-descriptions-item label="个人网站" :span="2">
          <el-link
            v-if="currentComment.personalWebsite"
            :href="currentComment.personalWebsite"
            target="_blank"
            type="primary"
          >
            {{ currentComment.personalWebsite }}
          </el-link>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="评论类型">
          <el-tag :type="getCommentTypeTag(currentComment.type)">
            {{ getCommentTypeText(currentComment.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="currentComment.status === '0'" type="success">正常</el-tag>
          <el-tag v-else-if="currentComment.status === '1'" type="warning">待审核</el-tag>
          <el-tag v-else-if="currentComment.status === '2'" type="danger">审核未通过</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所属文章" :span="2">
          {{ currentComment.articleTitle || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="回复对象">
          {{ currentComment.replyToNickname || "无" }}
        </el-descriptions-item>
        <el-descriptions-item label="点赞数">
          {{ currentComment.likeCount || 0 }}
        </el-descriptions-item>
        <el-descriptions-item label="评论时间" :span="2">
          {{ currentComment.createTime }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 回复评论对话框 -->
    <el-dialog v-model="replyDialogVisible" title="回复评论" width="600px" append-to-body>
      <el-form ref="replyFormRef" :model="replyForm" :rules="replyRules" label-width="100px">
        <el-form-item label="评论者">
          <el-tag size="small">{{ currentComment.nickname }}</el-tag>
        </el-form-item>
        <el-form-item label="评论内容">
          <div style="padding: 10px; color: #606266; background: #f5f7fa; border-radius: 4px">
            {{ currentComment.content }}
          </div>
        </el-form-item>
        <el-form-item label="回复内容" prop="content">
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="5"
            placeholder="请输入回复内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitReply">确定</el-button>
      </template>
    </el-dialog>

    <!-- 审核评论对话框 -->
    <el-dialog v-model="reviewDialogVisible" title="审核评论" width="700px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="评论内容" :span="2">
          <div style="white-space: pre-wrap">{{ currentComment.content }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="评论者昵称">
          {{ currentComment.nickname }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ currentComment.email }}
        </el-descriptions-item>
        <el-descriptions-item label="个人网站" :span="2">
          <el-link
            v-if="currentComment.personalWebsite"
            :href="currentComment.personalWebsite"
            target="_blank"
            type="primary"
          >
            {{ currentComment.personalWebsite }}
          </el-link>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="评论类型">
          <el-tag :type="getCommentTypeTag(currentComment.type)">
            {{ getCommentTypeText(currentComment.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前状态">
          <el-tag type="warning">待审核</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所属文章" :span="2">
          {{ currentComment.articleTitle || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="回复对象">
          {{ currentComment.replyToNickname || "无" }}
        </el-descriptions-item>
        <el-descriptions-item label="点赞数">
          {{ currentComment.likeCount || 0 }}
        </el-descriptions-item>
        <el-descriptions-item label="评论时间" :span="2">
          {{ currentComment.createTime }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div style="display: flex; gap: 12px; justify-content: center">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleRejectReview">拒绝发布</el-button>
          <el-button type="success" @click="handleApproveReview">允许发布</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导出方式选择对话框 -->
    <el-dialog v-model="exportDialogVisible" title="请选择导出方式" width="420px" append-to-body>
      <div style="padding: 10px 0">
        <div style="font-size: 14px; line-height: 1.8; color: #606266">
          <p style="margin: 0 0 8px 0">导出当前页：{{ commentList.length }} 条评论数据</p>
          <p style="margin: 0">导出全部：{{ total }} 条评论数据</p>
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
import { ChatDotSquare, Clock, Close, Promotion } from "@element-plus/icons-vue";
import BlogCommentAPI from "@/api/blog/comment";
import BlogPostAPI from "@/api/blog/post";
import { downloadFile } from "@/utils/download";
import type {
  BlogCommentItem,
  BlogCommentQueryParams,
  BlogCommentForm,
  BlogCommentStatistics,
  BlogPostItem,
} from "@/types/api";

defineOptions({ name: "BlogComment", inheritAttrs: false });

const queryFormRef = ref();
const replyFormRef = ref();
const loading = ref(false);
const total = ref(0);
const selectIds = ref<string[]>([]);
const commentList = ref<BlogCommentItem[]>([]);
const articleList = ref<BlogPostItem[]>([]);
const dateRange = ref<[string, string]>();
const detailDialogVisible = ref(false);
const replyDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const exportDialogVisible = ref(false);
const currentComment = ref<BlogCommentItem>({});
const statistics = ref<BlogCommentStatistics>({});

const queryParams = reactive<BlogCommentQueryParams>({
  pageNum: 1,
  pageSize: 10,
});

const replyForm = reactive<BlogCommentForm>({
  content: "",
  parentId: "",
  rootId: "",
  replyToUserId: "",
  replyToCommentId: "",
  type: "0",
  articleId: "",
});

const replyRules = {
  content: [{ required: true, message: "请输入回复内容", trigger: "blur" }],
};

// 获取评论类型标签
function getCommentTypeTag(type?: string): "success" | "warning" | "primary" | "info" | "danger" {
  const tags: Record<string, "success" | "warning" | "primary" | "info" | "danger"> = {
    "0": "primary",
    "1": "success",
    "2": "warning",
  };
  return tags[type ?? "0"];
}

// 获取评论类型文本
function getCommentTypeText(type?: string) {
  const texts: Record<string, string> = {
    "0": "文章评论",
    "1": "友链留言",
    "2": "留言板",
  };
  return texts[type ?? "0"];
}

// 获取评论列表
async function fetchList() {
  loading.value = true;
  try {
    // 处理时间范围
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.startTime = dateRange.value[0];
      queryParams.endTime = dateRange.value[1];
    } else {
      queryParams.startTime = undefined;
      queryParams.endTime = undefined;
    }

    const data = await BlogCommentAPI.getPage(queryParams);
    commentList.value = data.rows;
    total.value = data.total ?? 0;
  } finally {
    loading.value = false;
  }
}

// 获取统计信息
async function fetchStatistics() {
  try {
    statistics.value = await BlogCommentAPI.getStatistics();
  } catch (error) {
    console.error("获取统计信息失败:", error);
  }
}

// 加载文章列表
async function loadArticleList() {
  if (articleList.value.length > 0) return; // 已加载则不重复请求

  try {
    const data = await BlogPostAPI.getPage({
      pageNum: 1,
      pageSize: 1000, // 获取所有文章
    });
    articleList.value = data.rows || [];
  } catch (error) {
    console.error("获取文章列表失败:", error);
  }
}

// 评论类型变化处理
function handleTypeChange(value: string) {
  // 如果不是文章评论，清空文章ID
  if (value !== "0") {
    queryParams.articleId = undefined;
  }
}

// 搜索
function handleQuery() {
  queryParams.pageNum = 1;
  fetchList();
}

// 重置搜索
function handleResetQuery() {
  queryFormRef.value?.resetFields();
  dateRange.value = undefined;
  handleQuery();
}

// 选择变化
function handleSelectionChange(selection: BlogCommentItem[]) {
  selectIds.value = selection.map((item) => item.id!).filter(Boolean);
}

// 查看详情
function handleView(row: BlogCommentItem) {
  currentComment.value = { ...row };
  detailDialogVisible.value = true;
}

// 打开审核对话框
function handleOpenReviewDialog(row: BlogCommentItem) {
  currentComment.value = { ...row };
  reviewDialogVisible.value = true;
}

// 允许评论（审核通过）
function handleApproveReview() {
  const id = currentComment.value.id;
  if (!id) return;

  loading.value = true;
  BlogCommentAPI.approve(id)
    .then(() => {
      ElMessage.success("审核通过");
      reviewDialogVisible.value = false;
      fetchList();
      fetchStatistics();
    })
    .finally(() => (loading.value = false));
}

// 拒绝评论（审核未通过）
function handleRejectReview() {
  const id = currentComment.value.id;
  if (!id) return;

  loading.value = true;
  BlogCommentAPI.reject(id)
    .then(() => {
      ElMessage.success("已拒绝该评论进行发布");
      reviewDialogVisible.value = false;
      fetchList();
      fetchStatistics();
    })
    .finally(() => (loading.value = false));
}

// 审核: 允许评论发布
function handleApprove(id?: string) {
  const ids = id ?? selectIds.value.join(",");
  if (!ids) {
    ElMessage.warning("请选择要审核的评论");
    return;
  }

  ElMessageBox.confirm("确认允许选中的评论进行发布?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    loading.value = true;
    BlogCommentAPI.approve(ids)
      .then((response) => {
        ElMessage.success(response.msg);
        fetchList();
        fetchStatistics();
      })
      .finally(() => (loading.value = false));
  });
}

// 审核：拒绝评论发布
function handleBatchApprove() {
  if (selectIds.value.length === 0) {
    ElMessage.warning("请选择要审核的评论");
    return;
  }
  handleApprove();
}

// 批量拒绝
function handleBatchReject() {
  if (selectIds.value.length === 0) {
    ElMessage.warning("请选择要拒绝的评论");
    return;
  }

  ElMessageBox.confirm("确认拒绝选中的评论?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    const ids = selectIds.value.join(",");
    loading.value = true;
    BlogCommentAPI.reject(ids)
      .then((response) => {
        ElMessage.success(response.msg);
        fetchList();
        fetchStatistics();
      })
      .finally(() => (loading.value = false));
  });
}

// 回复评论
function handleReply(row: BlogCommentItem) {
  currentComment.value = { ...row };
  replyForm.content = "";
  replyForm.parentId = row.id;
  replyForm.rootId = row.rootId && row.rootId !== "-1" ? row.rootId : row.id;
  replyForm.replyToUserId = row.userId;
  replyForm.replyToCommentId = row.id;
  replyForm.type = row.type;
  replyForm.articleId = row.articleId;
  replyDialogVisible.value = true;
}

// 提交回复
function handleSubmitReply() {
  replyFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      BlogCommentAPI.create(replyForm)
        .then(() => {
          ElMessage.success("回复成功");
          replyDialogVisible.value = false;
          fetchList();
          fetchStatistics();
        })
        .finally(() => (loading.value = false));
    }
  });
}

// 删除评论
function handleDelete(id?: string) {
  const ids = id ?? selectIds.value.join(",");
  if (!ids) {
    ElMessage.warning("请选择要删除的评论");
    return;
  }

  ElMessageBox.confirm("确认删除选中的评论? 删除后将无法恢复!", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    BlogCommentAPI.deleteByIds(ids)
      .then((response) => {
        ElMessage.success(response.msg);
        fetchList();
        fetchStatistics();
      })
      .finally(() => (loading.value = false));
  });
}

// 导出评论
function handleExport() {
  exportDialogVisible.value = true;
}

// 执行导出
function handleConfirmExport(isCurrentPage: boolean) {
  const exportType = isCurrentPage ? "当前页" : "全部";
  const exportCount = isCurrentPage ? commentList.value.length : total.value;

  // 关闭导出方式选择对话框
  exportDialogVisible.value = false;

  // 二次确认
  ElMessageBox.confirm(`确认导出${exportType} ${exportCount} 条评论数据？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      loading.value = true;

      // 构建导出参数
      const exportParams: Partial<BlogCommentQueryParams> = { ...queryParams };

      if (!isCurrentPage) {
        // 导出全部：移除分页参数
        exportParams.pageNum = undefined;
        exportParams.pageSize = undefined;
      }
      // 导出当前页：保留原有的 pageNum 和 pageSize
      BlogCommentAPI.export(exportParams)
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
      // 用户取消导出，不做任何操作
    });
}

onMounted(() => {
  fetchStatistics();
  handleQuery();
});

onActivated(() => {
  fetchStatistics();
  fetchList();
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.filter-section {
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 4px;

  .search-buttons {
    margin-left: 10px;
  }
}

.table-section {
  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;

    &--actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    &--right {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }
  }

  &__content {
    margin-bottom: 16px;
  }
}

.statistics-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;

  .statistic-card {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    height: 32px;
    padding: 6px 12px;
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &__icon {
      flex-shrink: 0;
      margin-right: 8px;
    }

    &__content {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    &__value {
      font-size: 14px;
      line-height: 1;
      color: #303133;
    }

    &__label {
      font-size: 12px;
      line-height: 1;
      color: #909399;
      white-space: nowrap;
    }
  }
}
</style>
