<!-- 写博客 -->
<template>
  <div class="app-container">
    <el-card shadow="hover">
      <template #header>
        <div class="flex-x-between">
          <span class="text-lg font-medium">{{ isEdit ? "编辑文章" : "写文章" }}</span>
          <div>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit(0)">保存草稿</el-button>
            <el-button type="success" :loading="submitting" @click="handleSubmit(1)">发布文章</el-button>
          </div>
        </div>
      </template>

      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="100" show-word-limit />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文章分类" prop="categoryId">
              <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章标签" prop="tagIds">
              <el-select v-model="formData.tagIds" multiple placeholder="请选择标签" style="width: 100%">
                <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="文章摘要" prop="summary">
          <el-input v-model="formData.summary" type="textarea" :rows="3" placeholder="请输入文章摘要（选填）" maxlength="300" show-word-limit />
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <div style="width: 100%">
            <WangEditor v-model="formData.content" height="500px" />
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
import type { BlogPostForm } from "@/types/api";

defineOptions({ name: "BlogWrite", inheritAttrs: false });

const router = useRouter();
const route = useRoute();
const formRef = ref();
const submitting = ref(false);
const categoryOptions = ref<OptionItem[]>([]);
const tagOptions = ref<OptionItem[]>([]);

const postId = computed(() => route.query.id as string | undefined);
const isEdit = computed(() => !!postId.value);

const formData = reactive<BlogPostForm>({ title: "", summary: "", content: "", tagIds: [] });

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
    const payload = { ...formData, status };
    if (isEdit.value) {
      await BlogPostAPI.update(postId.value!, payload);
      ElMessage.success("修改成功");
    } else {
      await BlogPostAPI.create(payload);
      ElMessage.success(status === 1 ? "发布成功" : "已保存草稿");
    }
    router.push("/blog/post");
  } finally {
    submitting.value = false;
  }
}

function handleCancel() {
  router.push("/blog/post");
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
