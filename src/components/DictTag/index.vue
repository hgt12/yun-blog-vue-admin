<template>
  <template v-if="tagType">
    <el-tag :type="tagType" :size="tagSize">{{ label }}</el-tag>
  </template>
  <template v-else>
    <span>{{ label }}</span>
  </template>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDictStore } from "@/store";

const props = defineProps({
  code: String, // 字典编码
  modelValue: [String, Number], // 字典项的值
  size: {
    type: String,
    default: "default", // 标签大小
  },
});

const label = ref("");
const tagType = ref<"success" | "warning" | "info" | "primary" | "danger" | undefined>(); // 标签类型
const tagSize = ref<"default" | "large" | "small">(props.size as "default" | "large" | "small"); // 标签大小

const dictStore = useDictStore();
const { dictVersion } = storeToRefs(dictStore);

/**
 * 根据字典项的值获取对应的 label 和 tagType
 * @param dictCode 字典编码
 * @param value 字典项的值
 * @param refresh 是否强制刷新缓存
 * @returns 包含 label 和 tagType 的对象
 */
const getLabelAndTagByValue = async (dictCode: string, value: any, refresh = false) => {
  // 按需加载字典数据
  if (refresh) {
    await dictStore.refreshDictItems(dictCode);
  } else {
    await dictStore.loadDictItems(dictCode);
  }
  // 从缓存中获取字典数据
  const dictItems = dictStore.getDictItems(dictCode);
  // 查找对应的字典项
  const dictItem = dictItems.find((item) => item.value == value);
  return {
    label: dictItem?.label || "",
    tagType: dictItem?.tagType,
  };
};

/**
 * 更新 label 和 tagType
 * @param refresh 是否强制刷新缓存
 */
const updateLabelAndTag = async (refresh = false) => {
  if (!props.code || props.modelValue === undefined) return;
  const { label: newLabel, tagType: newTagType } = await getLabelAndTagByValue(
    props.code,
    props.modelValue,
    refresh
  );
  label.value = newLabel;
  tagType.value = newTagType as typeof tagType.value;
};

// 初始化、code变化、值变化或字典版本变化时更新标签和标签样式
watch(
  [() => props.code, () => props.modelValue, () => dictVersion.value],
  async () => {
    if (props.code) {
      await updateLabelAndTag(true);
    }
  },
  { immediate: true }
);
</script>
