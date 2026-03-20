<template>
  <div class="auth-panel-form">
    <h3 class="auth-panel-form__title" text-center>{{ t("login.reg") }}</h3>
    <el-form ref="formRef" :model="model" :rules="rules" size="large" :validate-on-rule-change="false">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model.trim="model.username" :placeholder="t('login.username')" autocomplete="username">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 手机号/邮箱 -->
      <el-form-item prop="account">
        <el-input v-model.trim="model.account" placeholder="手机号/邮箱" autocomplete="email">
          <template #prefix>
            <el-icon><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
        <el-form-item prop="password">
          <el-input
            v-model.trim="model.password"
            :placeholder="t('login.password')"
            type="password"
            show-password
            autocomplete="new-password"
            @keyup="checkCapsLock"
            @keyup.enter="submit"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <!-- 确认密码 -->
      <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
        <el-form-item prop="confirmPassword">
          <el-input
            v-model.trim="model.confirmPassword"
            :placeholder="t('login.message.password.confirm')"
            type="password"
            show-password
            autocomplete="new-password"
            @keyup="checkCapsLock"
            @keyup.enter="submit"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <!-- 图形验证码 -->
      <el-form-item prop="captchaCode">
        <div flex items-center gap-10px>
          <el-input
            v-model.trim="model.captchaCode"
            :placeholder="t('login.captchaCode')"
            clearable
            class="flex-1"
            @keyup.enter="submit"
          >
            <template #prefix>
              <div class="i-svg:captcha" />
            </template>
          </el-input>
          <div cursor-pointer h-44px w-140px flex-center @click="getCaptcha">
            <el-icon v-if="codeLoading" class="is-loading" size="20"><Loading /></el-icon>
            <img
              v-else-if="captchaBase64"
              border-rd-4px
              w-full
              h-full
              block
              object-cover
              shadow="[0_0_0_1px_var(--el-border-color)_inset]"
              :src="captchaBase64"
              alt="captchaCode"
              title="点击刷新验证码"
              @error="getCaptcha"
            />
            <el-text v-else type="info" size="small">点击获取验证码</el-text>
          </div>
        </div>
      </el-form-item>

      <!-- 用户协议 -->
      <el-form-item>
        <div class="flex-y-center w-full gap-10px">
          <el-checkbox v-model="isRead">{{ t("login.agree") }}</el-checkbox>
          <el-link type="primary" underline="never">{{ t("login.userAgreement") }}</el-link>
        </div>
      </el-form-item>

      <!-- 注册按钮 -->
      <el-form-item>
        <el-button :loading="loading" type="success" class="w-full" @click="submit">
          {{ t("login.reg") }}
        </el-button>
      </el-form-item>
    </el-form>

    <div flex-center gap-10px>
      <el-text size="default">{{ t("login.haveAccount") }}</el-text>
      <el-link type="primary" underline="never" @click="toLogin">{{ t("login.login") }}</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type { FormInstance } from "element-plus";
import { Lock, Message } from "@element-plus/icons-vue";
import AuthAPI from "@/api/auth";

const { t } = useI18n();

const emit = defineEmits(["update:modelValue"]);
const toLogin = () => emit("update:modelValue", "login");

onMounted(() => getCaptcha());

const formRef = ref<FormInstance>();
const loading = ref(false);
const isCapsLock = ref(false);
const captchaBase64 = ref("");
const codeLoading = ref(false);
const isRead = ref(false);

const isPhone = (v: string) => /^1[3-9]\d{9}$/.test(v);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const model = ref({
  username: "",
  account: "",
  password: "",
  confirmPassword: "",
  captchaId: "",
  captchaCode: "",
});

const rules = computed(() => ({
  username: [
    { required: true, trigger: "blur", message: t("login.message.username.required") },
    { min: 3, trigger: "blur", message: "用户名至少3个字符" },
  ],
  account: [
    { required: true, trigger: "blur", message: "请输入手机号或邮箱" },
    {
      trigger: "blur",
      validator: (_: any, value: string) => isPhone(value) || isEmail(value),
      message: "请输入有效的手机号或邮箱",
    },
  ],
  password: [
    { required: true, trigger: "blur", message: t("login.message.password.required") },
    { min: 8, max: 20, trigger: "blur", message: "密码长度为8-20位" },
    {
      trigger: "blur",
      validator: (_: any, value: string) => /\d/.test(value) && /[a-zA-Z]/.test(value),
      message: "密码必须同时包含字母和数字",
    },
  ],
  confirmPassword: [
    { required: true, trigger: "blur", message: t("login.message.password.confirm") },
    {
      trigger: "blur",
      validator: (_: any, value: string) => value === model.value.password,
      message: t("login.message.password.inconformity"),
    },
  ],
  captchaCode: [
    { required: true, trigger: "blur", message: t("login.message.captchaCode.required") },
  ],
}));

function getCaptcha() {
  codeLoading.value = true;
  AuthAPI.getCaptcha()
    .then((data) => {
      model.value.captchaId = data.captchaId;
      captchaBase64.value = data.captchaBase64;
    })
    .finally(() => (codeLoading.value = false));
}

function checkCapsLock(event: KeyboardEvent) {
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
}

async function submit() {
  await formRef.value?.validate();
  if (!isRead.value) {
    ElMessage.warning("请先阅读并同意用户协议");
    return;
  }
  loading.value = true;
  try {
    const account = model.value.account.trim();
    const payload: Record<string, any> = {
      username: model.value.username,
      password: model.value.password,
      captchaId: model.value.captchaId,
      captchaCode: model.value.captchaCode,
    };
    if (isPhone(account)) {
      payload.phone = account;
    } else {
      payload.email = account;
    }
    await AuthAPI.register(payload as any);
    ElMessage.success("注册成功，请登录");
    emit("update:modelValue", "login");
  } catch (err: any) {
    ElMessage.error(err?.message || "注册失败，请重试");
    getCaptcha();
  } finally {
    loading.value = false;
  }
}
</script>
