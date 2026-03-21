<template>
  <el-dropdown trigger="click" @command="handleLanguageChange" popper-class="lang-select-dropdown">
    <div class="i-svg:language" :class="size" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in langOptions"
          :key="item.value"
          :disabled="appStore.language === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { LanguageEnum } from "@/enums/settings";

defineProps({
  size: {
    type: String,
    required: false,
  },
});

const langOptions = [
  { label: "中文", value: LanguageEnum.ZH_CN },
  { label: "English", value: LanguageEnum.EN },
];

const appStore = useAppStore();
const { locale, t } = useI18n();

/**
 * 处理语言切换
 *
 * @param lang  语言（zh-cn、en�?
 */
function handleLanguageChange(lang: string) {
  locale.value = lang;
  appStore.changeLanguage(lang);

  ElMessage.success(t("langSelect.message.success"));
}
</script>

<style lang="scss">
.lang-select-dropdown {
  border-radius: 12px !important;
  padding: 8px !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid var(--el-border-color-light) !important;
  
  .el-dropdown-menu__item {
    border-radius: 8px !important;
    margin: 2px 0 !important;
    padding: 8px 16px !important;
    transition: all 0.3s ease !important;
    
    &:hover {
      background-color: var(--el-fill-color-light) !important;
      color: var(--el-color-primary) !important;
    }
    
    &.is-disabled {
      background-color: var(--el-fill-color) !important;
      color: var(--el-color-primary) !important;
      opacity: 1 !important;
      cursor: default !important;
    }
  }
}

.dark .lang-select-dropdown {
  background-color: var(--el-bg-color-overlay) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
  border-color: var(--el-border-color) !important;
  
  .el-dropdown-menu__item {
    &:hover {
      background-color: rgba(255, 255, 255, 0.08) !important;
    }
    
    &.is-disabled {
      background-color: rgba(255, 255, 255, 0.12) !important;
    }
  }
}
</style>
