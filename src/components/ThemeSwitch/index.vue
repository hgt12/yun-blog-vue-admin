<template>
  <el-icon :size="20" style="cursor: pointer" @click="toggleTheme">
    <component :is="settingsStore.theme === ThemeMode.DARK ? Moon : Sunny" />
  </el-icon>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/store";
import { ThemeMode } from "@/enums";
import { Moon, Sunny } from "@element-plus/icons-vue";

const settingsStore = useSettingsStore();

const toggleTheme = () => {
  settingsStore.theme =
    settingsStore.theme === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;
};
</script>
