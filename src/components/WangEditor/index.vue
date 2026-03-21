<!--
 * 基于 wangEditor-next 的富文本编辑器组件二次封装
 * 版权所属 © 2021-present 有来开源组织
 *
 * 开源协议：https://opensource.org/licenses/MIT
 * 项目地址：https://gitee.com/youlaiorg/vue3-element-admin
 *
 * 在使用时，请保留此注释，感谢您对开源的支持
-->

<template>
  <div style="z-index: 999; border: 1px solid var(--el-border-color); position: relative;">
    <!-- 工具栏 -->
    <Toolbar
      v-if="editorRef"
      :key="editorKey"
      :editor="editorRef"
      mode="simple"
      :default-config="toolbarConfig"
      style="border-bottom: 1px solid var(--el-border-color)"
    />
    <!-- 编辑器 -->
    <Editor
      :key="editorKey"
      v-model="modelValue"
      :style="{ height: height, overflowY: 'hidden' }"
      :default-config="editorConfig"
      mode="simple"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import "@wangeditor-next/editor/dist/css/style.css";
import { Toolbar, Editor } from "@wangeditor-next/editor-for-vue";
import { IToolbarConfig, IEditorConfig } from "@wangeditor-next/editor";

// 文件上传 API
import FileAPI from "@/api/file";

// 上传图片回调函数类型
type InsertFnType = (_url: string, _alt: string, _href: string) => void;

defineProps({
  height: {
    type: String,
    default: "500px",
  },
});

const emit = defineEmits(["switch-mode"]);

// 切换模式
const handleSwitchMode = () => {
  emit("switch-mode");
};
// 双向绑定 - 直接使用 v-model，无需手动 setHtml
const modelValue = defineModel<string>({
  type: String,
  required: false,
  default: "",
});

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const editorKey = ref(0);
const innerUpdating = ref(false);

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {};

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容..",
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: InsertFnType) {
        const data = await FileAPI.uploadFile(file);
        insertFn(data.url, data.name, data.url);
      },
    } as any,
  },
};

// 记录 editor 实例
const handleCreated = (editor: any) => {
  editorRef.value = editor;
  
  // 在工具栏中添加自定义按钮
  nextTick(() => {
    const toolbar = document.querySelector('.w-e-toolbar');
    if (toolbar) {
      // 创建分隔线
      const divider = document.createElement('div');
      divider.className = 'w-e-bar-divider';
      divider.style.cssText = `
        display: inline-block;
        width: 1px;
        height: 40px;
        background-color: #e8e8e8;
        margin: 0 5px;
        vertical-align: middle;
      `;
      
      // 创建自定义按钮容器
      const customBtn = document.createElement('div');
      customBtn.className = 'w-e-bar-item';
      customBtn.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 0 5px;
        cursor: pointer;
        position: relative;
        vertical-align: middle;
      `;
      
      // 创建按钮内容
      const btnContent = document.createElement('div');
      btnContent.className = 'w-e-bar-item-menu';
      btnContent.title = '切换到Markdown模式';
      btnContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 30px;
        border-radius: 3px;
        transition: background-color 0.3s;
        font-size: 14px;
        font-weight: 600;
        color: #595959;
        font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;
        letter-spacing: 0.5px;
      `;
      
      // 创建MD文字
      btnContent.innerHTML = `MD`;
      
      // 鼠标悬停效果
      btnContent.addEventListener('mouseenter', () => {
        btnContent.style.backgroundColor = '#f1f1f1';
      });
      btnContent.addEventListener('mouseleave', () => {
        btnContent.style.backgroundColor = 'transparent';
      });
      
      // 点击事件
      customBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSwitchMode();
      });
      
      customBtn.appendChild(btnContent);
      
      // 先插入分隔线，再插入按钮
      toolbar.appendChild(divider);
      toolbar.appendChild(customBtn);
    }
  });
};

const handleChange = () => {
  innerUpdating.value = true;
  Promise.resolve().then(() => {
    innerUpdating.value = false;
  });
};

watch(
  () => modelValue.value,
  () => {
    if (innerUpdating.value) return;
    editorRef.value = null;
    editorKey.value += 1;
  }
);

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<style scoped lang="scss">
:deep(.w-e-bar-item-menus-container) {
  .w-e-bar-item-menu {
    &:hover {
      background-color: #f1f1f1;
    }
  }
}
</style>
