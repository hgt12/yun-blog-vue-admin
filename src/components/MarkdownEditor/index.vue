<!--
 *
 * MD编辑器
 * @author mengze
 *
-->
<template>
  <div class="markdown-editor-wrapper">
    <MdEditor
      v-model="modelValue"
      :preview="false"
      :toolbars-exclude="['github']"
      language="zh-CN"
      :style="editorStyle"
      :toolbars="toolbars"
      @on-upload-img="handleUploadImg"
    >
      <template #defToolbars>
        <NormalToolbar title="切换到富文本模式" @on-click="$emit('switch-mode')">
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
</template>

<script setup lang="ts">
import { MdEditor, NormalToolbar, config, type ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import FileAPI from "@/api/file";

// 将自定义工具栏位置单独声明为符合类型的常量
const CUSTOM_TOOLBAR_INDEX = 0 as ToolbarNames;

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

const props = defineProps({
  height: {
    type: String,
    default: "500px",
  },
});

defineEmits(["switch-mode"]);

const modelValue = defineModel<string>({
  type: String,
  required: false,
  default: "",
});

const toolbars: ToolbarNames[] = [
  "bold",
  "underline",
  "italic",
  "strikeThrough",
  "-",
  "title",
  "sub",
  "sup",
  "quote",
  "unorderedList",
  "orderedList",
  "task",
  "-",
  "codeRow",
  "code",
  "link",
  "image",
  "table",
  "-",
  "revoke",
  "next",
  "-",
  "pageFullscreen",
  "fullscreen",
  "preview",
  "catalog",
  CUSTOM_TOOLBAR_INDEX,
];

const editorStyle = computed(() => ({ height: props.height }));

async function handleUploadImg(files: File[], callback: (urls: string[]) => void) {
  try {
    const maxSize = 2 * 1024 * 1024;
    const invalidFiles = files.filter((file) => file.size > maxSize);
    if (invalidFiles.length > 0) {
      ElMessage.warning("图片大小不能超过2MB");
      return;
    }

    const invalidTypes = files.filter((file) => !file.type.startsWith("image/"));
    if (invalidTypes.length > 0) {
      ElMessage.warning("仅支持上传图片文件");
      return;
    }

    const urls = await Promise.all(files.map((file) => FileAPI.uploadImage(file)));
    callback(urls);
    ElMessage.success("上传成功");
  } catch (error) {
    ElMessage.error("上传失败");
    console.error("图片上传失败:", error);
  }
}
</script>

<style scoped lang="scss">
.markdown-editor-wrapper {
  width: 100%;

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
    height: calc(v-bind("props.height") - 40px) !important;
  }
}
</style>
