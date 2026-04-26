<!-- 写博客 -->
<template>
  <div class="app-container">
    <el-card shadow="hover">
      <template #header>
        <div class="flex-x-between">
          <span class="text-lg font-medium">{{ isEdit ? "编辑文章" : "写博客" }}</span>
          <div>
            <el-button @click="handleCancel">取消</el-button>
            <el-button
              v-hasPerm="['blog:post:create', 'blog:post:update']"
              type="primary"
              :loading="submitting"
              @click="handleSubmit(1)"
            >
              保存草稿
            </el-button>
            <el-button
              v-hasPerm="['blog:post:create', 'blog:post:update']"
              type="success"
              :loading="submitting"
              @click="handleSubmit(0)"
            >
              发布文章
            </el-button>
          </div>
        </div>
      </template>

      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入文章标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文章分类" prop="categoryId">
              <el-select-v2
                v-model="formData.categoryId"
                :options="categoryOptions"
                placeholder="请选择分类"
                filterable
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章标签" prop="tags">
              <el-select-v2
                v-model="formData.tags"
                :options="tagOptions"
                placeholder="请选择标签"
                filterable
                clearable
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="3"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="文章摘要" prop="summary">
          <el-input
            v-model="formData.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要（选填）"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否置顶" prop="isTop">
              <el-switch
                v-model="formData.isTop"
                active-value="1"
                inactive-value="0"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="允许评论" prop="isComment">
              <el-switch
                v-model="formData.isComment"
                active-value="1"
                inactive-value="0"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="缩略图" prop="thumbnail" class="thumbnail-form-item">
          <div class="thumbnail-upload-wrapper">
            <SingleImageUpload
              v-model="formData.thumbnail"
              :max-file-size="2"
              :style="{ width: '200px', height: '150px' }"
            />
            <div class="el-upload__tip">
              建议尺寸：800x600，支持png、jpg、gif、jpeg格式，大小不超过2MB
            </div>
          </div>
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <div class="content-editor-wrapper">
            <div class="editor-container" :style="{ width: editorWidth }">
              <!-- 富文本编辑器 -->
              <div v-show="editorMode === 'rich'" class="editor-mode-container">
                <WangEditor
                  v-model="formData.content"
                  height="500px"
                  @switch-mode="switchEditorMode"
                />
              </div>
              <!-- Markdown编辑器 -->
              <div
                v-show="editorMode === 'markdown'"
                class="editor-mode-container markdown-editor-wrapper"
              >
                <MdEditor
                  v-model="formData.content"
                  :preview="false"
                  :toolbars-exclude="['github']"
                  language="zh-CN"
                  style="height: 500px"
                  :toolbars="[
                    'bold',
                    'underline',
                    'italic',
                    'strikeThrough',
                    '-',
                    'title',
                    'sub',
                    'sup',
                    'quote',
                    'unorderedList',
                    'orderedList',
                    'task',
                    '-',
                    'codeRow',
                    'code',
                    'link',
                    'image',
                    'table',
                    '-',
                    'revoke',
                    'next',
                    '-',
                    'pageFullscreen',
                    'fullscreen',
                    'preview',
                    'catalog',
                    0, // 自定义工具栏位置
                  ]"
                  @on-upload-img="handleMdUploadImg"
                >
                  <template #defToolbars>
                    <NormalToolbar title="切换到富文本模式" @on-click="switchEditorMode">
                      <template #trigger>
                        <el-button link size="small" style="padding: 2px 8px">
                          <el-icon><Edit /></el-icon>
                          <span style="margin-left: 4px; font-size: 14px">富文本</span>
                        </el-button>
                      </template>
                    </NormalToolbar>
                  </template>
                </MdEditor>
              </div>
            </div>
            <div class="resize-handle" @mousedown="startResize"></div>
            <div class="preview-container" :style="{ width: previewWidth }">
              <div class="preview-header">
                <span>预览</span>
                <el-button link @click="refreshPreview">
                  <el-icon><Refresh /></el-icon>
                </el-button>
              </div>
              <div class="preview-content" v-html="previewHtml"></div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import BlogPostAPI from "@/api/blog/post";
import BlogCategoryAPI from "@/api/blog/category";
import BlogTagAPI from "@/api/blog/tag";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import WangEditor from "@/components/WangEditor/index.vue";
import { MdEditor, NormalToolbar, config } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { marked } from "marked";
import type { BlogPostForm } from "@/types/api";
import FileAPI from "@/api/file";

// 配置 Markdown 编辑器语言
config({
  editorConfig: {
    languageUserDefined: {
      "zh-CN": {
        toolbarTips: {
          bold: "粗体",
          underline: "下划线",
          italic: "斜体",
          strikeThrough: "删除线",
          title: "标题",
          sub: "下标",
          sup: "上标",
          quote: "引用",
          unorderedList: "无序列表",
          orderedList: "有序列表",
          task: "任务列表",
          codeRow: "行内代码",
          code: "代码块",
          link: "链接",
          image: "图片",
          table: "表格",
          mermaid: "mermaid图",
          katex: "katex公式",
          revoke: "后退",
          next: "前进",
          save: "保存",
          prettier: "美化",
          pageFullscreen: "浏览器全屏",
          fullscreen: "屏幕全屏",
          preview: "预览",
          htmlPreview: "html代码预览",
          catalog: "目录",
          github: "github",
        },
        titleItem: {
          h1: "一级标题",
          h2: "二级标题",
          h3: "三级标题",
          h4: "四级标题",
          h5: "五级标题",
          h6: "六级标题",
        },
        imgTitleItem: {
          link: "添加图片链接",
          upload: "上传图片",
          clip2upload: "裁剪上传",
        },
        linkModalTips: {
          linkTitle: "添加链接",
          imageTitle: "添加图片",
          descLabel: "链接描述：",
          descLabelPlaceHolder: "请输入描述...",
          urlLabel: "链接地址：",
          urlLabelPlaceHolder: "请输入链接...",
          buttonOK: "确定",
        },
        clipModalTips: {
          title: "裁剪图片上传",
          buttonUpload: "上传",
        },
        copyCode: {
          text: "复制代码",
          successTips: "已复制！",
          failTips: "复制失败！",
        },
        mermaid: {
          flow: "流程图",
          sequence: "时序图",
          gantt: "甘特图",
          class: "类图",
          state: "状态图",
          pie: "饼图",
          relationship: "关系图",
          journey: "旅程图",
        },
        katex: {
          inline: "行内公式",
          block: "块级公式",
        },
        footer: {
          markdownTotal: "字数",
          scrollAuto: "同步滚动",
        },
      },
    },
  },
});

defineOptions({ name: "BlogWrite", inheritAttrs: false });

const router = useRouter();
const route = useRoute();
const formRef = ref();
const submitting = ref(false);
const categoryOptions = ref<OptionItem[]>([]);
const tagOptions = ref<OptionItem[]>([]);

const postId = computed(() => route.query.id as string | undefined);
const isEdit = computed(() => !!postId.value);

const formData = reactive<BlogPostForm>({
  title: "",
  summary: "",
  content: "",
  categoryId: "",
  tags: [],
  thumbnail: "",
  status: "1", // 默认草稿状态
  isTop: "0",
  isComment: "1",
});

// 编辑器和预览的宽度控制
const editorWidth = ref("50%");
const previewWidth = ref("50%");
const previewHtml = ref("");
const isResizing = ref(false);
const editorMode = ref<"rich" | "markdown">("rich"); // 编辑器模式：rich-富文本，markdown-Markdown

// 切换编辑器模式
function switchEditorMode() {
  editorMode.value = editorMode.value === "rich" ? "markdown" : "rich";
  ElMessage.success(`已切换到${editorMode.value === "rich" ? "富文本" : "Markdown"}模式`);
}

// 刷新预览
function refreshPreview() {
  if (editorMode.value === "markdown") {
    // Markdown 模式：将 Markdown 转换为 HTML
    previewHtml.value =
      (marked(formData.content || "") as string) ||
      "<p style='color: #999; text-align: center; padding: 20px;'>暂无内容</p>";
  } else {
    // 富文本模式：直接显示 HTML
    previewHtml.value =
      formData.content || "<p style='color: #999; text-align: center; padding: 20px;'>暂无内容</p>";
  }
}

// 监听内容变化自动更新预览
watch(
  () => formData.content,
  (newContent) => {
    if (editorMode.value === "markdown") {
      previewHtml.value =
        (marked(newContent || "") as string) ||
        "<p style='color: #999; text-align: center; padding: 20px;'>暂无内容</p>";
    } else {
      previewHtml.value =
        newContent || "<p style='color: #999; text-align: center; padding: 20px;'>暂无内容</p>";
    }
  },
  { immediate: true }
);

// 监听编辑器模式变化，更新预览
watch(editorMode, () => {
  refreshPreview();
});

// 开始调整大小
function startResize(e: MouseEvent) {
  isResizing.value = true;
  const startX = e.clientX;
  const container = (e.target as HTMLElement).parentElement;
  if (!container) return;

  const startEditorWidth = parseFloat(editorWidth.value);

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (!isResizing.value) return;

    const deltaX = moveEvent.clientX - startX;
    const containerWidth = container.offsetWidth;
    const deltaPercent = (deltaX / containerWidth) * 100;

    let newEditorWidth = startEditorWidth + deltaPercent;
    // 限制最小和最大宽度
    newEditorWidth = Math.max(30, Math.min(70, newEditorWidth));

    editorWidth.value = `${newEditorWidth}%`;
    previewWidth.value = `${100 - newEditorWidth}%`;
  };

  const onMouseUp = () => {
    isResizing.value = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

const rules = {
  title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
  categoryId: [{ required: true, message: "请选择文章分类", trigger: "change" }],
  content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
};

async function handleSubmit(status: number) {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  submitting.value = true;
  try {
    // 将status转换为字符串，并确保数据格式正确
    const payload = {
      ...formData,
      status: String(status), // 0-已发布，1-草稿
    };
    if (isEdit.value) {
      await BlogPostAPI.update(postId.value!, payload);
      ElMessage.success("修改成功");
    } else {
      await BlogPostAPI.create(payload);
      ElMessage.success(status === 1 ? "已保存草稿" : "发布成功");
    }
    router.push("/blog/list");
  } finally {
    submitting.value = false;
  }
}

function handleCancel() {
  router.push("/blog/list");
}

// Markdown 编辑器图片上传处理
async function handleMdUploadImg(files: File[], callback: (urls: string[]) => void) {
  try {
    // 验证文件大小（2MB限制）
    const maxSize = 2 * 1024 * 1024;
    const invalidFiles = files.filter((file) => file.size > maxSize);
    if (invalidFiles.length > 0) {
      ElMessage.warning("图片大小不能超过2MB");
      return;
    }

    const uploadPromises = files.map((file) => FileAPI.uploadFile(file));
    const urls = await Promise.all(uploadPromises);
    // 后端返回的直接是图片URL字符串数组
    callback(urls);
    ElMessage.success("上传成功");
  } catch (error) {
    ElMessage.error("上传失败");
    console.error("图片上传失败:", error);
  }
}

onMounted(async () => {
  [categoryOptions.value, tagOptions.value] = await Promise.all([
    BlogCategoryAPI.getOptions(),
    BlogTagAPI.getOptions(),
  ]);
  if (isEdit.value) {
    const data = await BlogPostAPI.getFormData(postId.value!);
    Object.assign(formData, data);
  }
});
</script>

<style scoped lang="scss">
.content-editor-wrapper {
  position: relative;
  display: flex;
  gap: 0;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.editor-container {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
}

.editor-mode-container {
  width: 100%;
  height: 100%;
}

.markdown-editor-wrapper {
  :deep(.md-editor) {
    width: 100% !important;
  }

  :deep(.md-editor-toolbar-wrapper) {
    display: flex;
    flex-wrap: wrap;
    height: auto !important;
    min-height: 40px;
    overflow: visible !important;
  }

  :deep(.md-editor-toolbar) {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: auto !important;
    overflow: visible !important;
  }

  :deep(.md-editor-toolbar-left) {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: auto !important;
    overflow: visible !important;

    .md-editor-toolbar-item {
      flex-shrink: 0;
    }
  }

  :deep(.md-editor-toolbar-right) {
    display: flex;
    flex-wrap: wrap;
    height: auto !important;
    overflow: visible !important;

    .md-editor-toolbar-item {
      flex-shrink: 0;
    }
  }

  :deep(.md-editor-toolbar-item) {
    margin: 2px;
  }

  :deep(.md-editor-input-wrapper) {
    height: calc(500px - 40px) !important;
  }
}

.resize-handle {
  flex-shrink: 0;
  width: 4px;
  cursor: col-resize;
  background: var(--el-border-color);
  transition: background 0.2s;

  &:hover {
    background: var(--el-color-primary);
  }
}

.preview-container {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  background: var(--el-bg-color);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  font-weight: 500;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color);
}

.preview-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  line-height: 1.6;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin: 20px 0 10px;
    font-weight: 600;
    line-height: 1.4;
  }

  :deep(h1) {
    padding-bottom: 10px;
    font-size: 2em;
    border-bottom: 1px solid var(--el-border-color);
  }
  :deep(h2) {
    padding-bottom: 8px;
    font-size: 1.5em;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
  :deep(h3) {
    font-size: 1.25em;
  }
  :deep(h4) {
    font-size: 1.1em;
  }

  :deep(p) {
    margin: 10px 0;
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    margin: 10px 0;
    border-radius: 4px;
  }

  :deep(pre) {
    padding: 15px;
    margin: 10px 0;
    overflow-x: auto;
    background: #f5f7fa;
    border-radius: 4px;

    code {
      padding: 0;
      color: inherit;
      background: transparent;
    }
  }

  :deep(code) {
    padding: 2px 6px;
    font-family: "Courier New", monospace;
    font-size: 0.9em;
    color: #e83e8c;
    background: #f5f7fa;
    border-radius: 3px;
  }

  :deep(blockquote) {
    padding: 10px 15px;
    padding-left: 15px;
    margin: 15px 0;
    color: #666;
    background: var(--el-fill-color-lighter);
    border-left: 4px solid var(--el-color-primary);
    border-radius: 0 4px 4px 0;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 25px;
    margin: 10px 0;
  }

  :deep(li) {
    margin: 5px 0;
  }

  :deep(table) {
    width: 100%;
    margin: 15px 0;
    border-collapse: collapse;

    th,
    td {
      padding: 8px 12px;
      text-align: left;
      border: 1px solid var(--el-border-color);
    }

    th {
      font-weight: 600;
      background: var(--el-fill-color-light);
    }

    tr:hover {
      background: var(--el-fill-color-lighter);
    }
  }

  :deep(a) {
    color: var(--el-color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(hr) {
    margin: 20px 0;
    border: none;
    border-top: 1px solid var(--el-border-color);
  }
}

.el-upload__tip {
  margin-top: 0;
  margin-left: 20px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.thumbnail-upload-wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.thumbnail-form-item {
  :deep(.el-form-item__label) {
    display: flex;
    align-items: center;
    height: 150px;
  }

  :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
  }
}
</style>
