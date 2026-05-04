<template>
  <el-scrollbar>
    <div :class="{ hidden: hidden }" class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :background="background"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="totalNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
const props = defineProps({
  total: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [10, 20, 30, 50, 100, 200, 500];
    },
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["pagination"]);

// 将 total 转换为数字类型供 ElPagination 使用（兼容字符串和数字）
const totalNumber = computed(() => {
  const val = props.total;
  return typeof val === "string" ? parseInt(val, 10) || 0 : val || 0;
});

const currentPage = defineModel("page", {
  type: Number,
  required: true,
  default: 1,
});

const pageSize = defineModel("limit", {
  type: Number,
  required: true,
  default: 10,
});

watch(
  () => props.total,
  (newVal: number | string) => {
    const total = typeof newVal === "string" ? parseInt(newVal, 10) || 0 : newVal || 0;
    const lastPage = Math.ceil(total / pageSize.value);
    if (total > 0 && currentPage.value > lastPage) {
      currentPage.value = lastPage;
      emit("pagination", { page: currentPage.value, limit: pageSize.value });
    }
  }
);

function handleSizeChange(val: number) {
  currentPage.value = 1;
  emit("pagination", { page: currentPage.value, limit: val });
}

function handleCurrentChange(val: number) {
  emit("pagination", { page: val, limit: pageSize.value });
}
</script>

<style lang="scss" scoped>
.pagination {
  padding: 12px;

  &.hidden {
    display: none;
  }
}
</style>
