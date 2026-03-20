<!-- 验证码登录表单 -->
<template>
  <div class="auth-panel-form">
    <h3 class="auth-panel-form__title" text-center>验证码登录</h3>
    <el-form ref="formRef" :model="form" :rules="rules" size="large" :validate-on-rule-change="false">
      <!-- 手机号/邮箱 -->
      <el-form-item prop="account">
        <el-input v-model.trim="form.account" placeholder="手机号/邮箱" autocomplete="username">
          <template #prefix>
            <el-icon><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item prop="code">
        <div flex items-center gap-10px>
          <el-input
            v-model.trim="form.code"
            placeholder="6位验证码"
            maxlength="6"
            clearable
            class="flex-1"
            @keyup.enter="handleSubmit"
          >
            <template #prefix>
              <div class="i-svg:captcha" />
            </template>
          </el-input>
          <el-button
            :loading="isSending"
            :disabled="countdown > 0"
            plain
            style="white-space: nowrap; min-width: 100px"
            @click="handleSendCode"
          >
            {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
          </el-button>
        </div>
      </el-form-item>

      <div class="flex-x-between w-full">
        <el-checkbox v-model="form.rememberMe">{{ t("login.rememberMe") }}</el-checkbox>
        <el-link type="primary" underline="never" @click="toOtherForm('login')">
          密码登录
        </el-link>
      </div>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button :loading="loading" type="primary" class="w-full" @click="handleSubmit">
          {{ t("login.login") }}
        </el-button>
      </el-form-item>
    </el-form>

    <div flex-center gap-10px>
      <el-text size="default">{{ t("login.noAccount") }}</el-text>
      <el-link type="primary" underline="never" @click="toOtherForm('register')">
        {{ t("login.reg") }}
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import AuthAPI from "@/api/auth";
import { AuthStorage } from "@/utils/auth";
import { useUserStore } from "@/store";
import router from "@/router";
import { useRoute } from "vue-router";

const { t } = useI18n();
const userStore = useUserStore();
const route = useRoute();

const formRef = ref<FormInstance>();
const loading = ref(false);
const isSending = ref(false);
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const form = ref({
  account: "",
  code: "",
  rememberMe: AuthStorage.getRememberMe(),
});

const isPhone = (v: string) => /^1[3-9]\d{9}$/.test(v);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const rules = computed(() => ({
  account: [
    { required: true, message: "请输入手机号或邮箱", trigger: "blur" },
    {
      validator: (_: any, value: string, cb: (e?: Error) => void) => {
        if (value && !isPhone(value) && !isEmail(value)) {
          cb(new Error("请输入有效的手机号或邮箱"));
        } else {
          cb();
        }
      },
      trigger: "blur",
    },
  ],
  code: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { len: 6, message: "验证码为6位数字", trigger: "blur" },
  ],
}));

function startCountdown() {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!);
      countdownTimer = null;
    }
  }, 1000);
}

async function handleSendCode() {
  // 先校验 account 字段
  const valid = await formRef.value?.validateField("account").then(
    () => true,
    () => false
  );
  if (!valid) return;

  isSending.value = true;
  try {
    await AuthAPI.sendCode({ account: form.value.account, type: "LOGIN" });
    startCountdown();
    ElMessage.success("验证码已发送");
  } catch (e: any) {
    ElMessage.error(e?.message || "发送验证码失败，请重试");
  } finally {
    isSending.value = false;
  }
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid) return;

  loading.value = true;
  try {
    const account = form.value.account;
    const rememberMe = form.value.rememberMe;
    let resp;

    if (isPhone(account)) {
      resp = await AuthAPI.loginByPhone({ phone: account, code: form.value.code, rememberMe });
    } else {
      resp = await AuthAPI.loginByEmail({ email: account, code: form.value.code, rememberMe });
    }

    AuthStorage.setTokens(resp.accessToken, resp.refreshToken, rememberMe);

    const redirectPath = (route.query.redirect as string) || "/";
    await router.push(decodeURIComponent(redirectPath));
  } catch (e: any) {
    ElMessage.error(e?.message || "登录失败，请重试");
  } finally {
    loading.value = false;
  }
}

const emit = defineEmits(["update:modelValue"]);
function toOtherForm(type: "login" | "register") {
  emit("update:modelValue", type);
}

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style lang="scss" scoped>
.auth-panel-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-panel-form__title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}
</style>
