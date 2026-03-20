<template>
  <div class="auth-panel-form">
    <h3 class="auth-panel-form__title" text-center>{{ t("login.resetPassword") }}</h3>
    <!-- 步骤1：输入邮箱 -->
    <el-form v-if="step === 1" ref="step1Ref" :model="form" :rules="step1Rules" size="large" :validate-on-rule-change="false">
      <el-text type="info" size="small" class="step-tip">请输入您的注册邮箱，我们将发送验证码到您的邮箱。</el-text>
      <el-form-item prop="email">
        <el-input v-model.trim="form.email" placeholder="邮箱" autocomplete="email">
          <template #prefix>
            <el-icon><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="warning" class="w-full" @click="handleSendCode">
          发送验证码
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 步骤2：输入验证码 -->
    <el-form v-else-if="step === 2" ref="step2Ref" :model="form" :rules="step2Rules" size="large" :validate-on-rule-change="false">
      <el-text type="info" size="small" class="step-tip">验证码已发送至 {{ form.email }}，请查收。</el-text>
      <el-form-item prop="code">
        <div flex items-center gap-10px>
          <el-input
            v-model.trim="form.code"
            placeholder="6位验证码"
            maxlength="6"
            clearable
            class="flex-1"
          >
            <template #prefix>
              <div class="i-svg:captcha" />
            </template>
          </el-input>
          <el-button
            :disabled="countdown > 0"
            plain
            style="white-space: nowrap; min-width: 100px"
            @click="handleSendCode"
          >
            {{ countdown > 0 ? `${countdown}s后重发` : '重新发送' }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="warning" class="w-full" @click="handleVerifyCode">
          验证
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 步骤3：重置密码 -->
    <el-form v-else-if="step === 3" ref="step3Ref" :model="form" :rules="step3Rules" size="large" :validate-on-rule-change="false">
      <el-text type="info" size="small" class="step-tip">请设置您的新密码。</el-text>
      <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
        <el-form-item prop="newPassword">
          <el-input
            v-model.trim="form.newPassword"
            placeholder="新密码"
            type="password"
            show-password
            autocomplete="new-password"
            @keyup="checkCapsLock"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>
      <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
        <el-form-item prop="confirmPassword">
          <el-input
            v-model.trim="form.confirmPassword"
            placeholder="确认新密码"
            type="password"
            show-password
            autocomplete="new-password"
            @keyup="checkCapsLock"
            @keyup.enter="handleResetPassword"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>
      <el-form-item>
        <el-button :loading="loading" type="warning" class="w-full" @click="handleResetPassword">
          重置密码
        </el-button>
      </el-form-item>
    </el-form>

    <div flex-center gap-10px>
      <el-text size="default">{{ t("login.thinkOfPasswd") }}</el-text>
      <el-link type="primary" underline="never" @click="toLogin">{{ t("login.login") }}</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import type { FormInstance } from "element-plus";
import { Lock, Message } from "@element-plus/icons-vue";
import AuthAPI from "@/api/auth";

const { t } = useI18n();
const emit = defineEmits(["update:modelValue"]);
const toLogin = () => emit("update:modelValue", "login");

const step = ref(1);
const loading = ref(false);
const isCapsLock = ref(false);
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const step1Ref = ref<FormInstance>();
const step2Ref = ref<FormInstance>();
const step3Ref = ref<FormInstance>();

const form = reactive({
  email: "",
  code: "",
  newPassword: "",
  confirmPassword: "",
});

const step1Rules = computed(() => ({
  email: [
    { required: true, trigger: "blur", message: "请输入邮箱" },
    { type: "email" as const, trigger: "blur", message: "请输入有效的邮箱地址" },
  ],
}));

const step2Rules = computed(() => ({
  code: [
    { required: true, trigger: "blur", message: "请输入验证码" },
    { len: 6, trigger: "blur", message: "验证码为6位" },
  ],
}));

const step3Rules = computed(() => ({
  newPassword: [
    { required: true, trigger: "blur", message: t("login.message.password.required") },
    { min: 6, trigger: "blur", message: t("login.message.password.min") },
  ],
  confirmPassword: [
    { required: true, trigger: "blur", message: t("login.message.password.confirm") },
    {
      trigger: "blur",
      validator: (_: any, value: string) => value === form.newPassword,
      message: t("login.message.password.inconformity"),
    },
  ],
}));

function startCountdown() {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(countdownTimer!);
  }, 1000);
}

async function handleSendCode() {
  await step1Ref.value?.validate();
  loading.value = true;
  try {
    await AuthAPI.sendCode({ account: form.email, type: "FORGOT_PASSWORD" });
    step.value = 2;
    startCountdown();
  } catch (err: any) {
    ElMessage.error(err?.message || "发送验证码失败，请重试");
  } finally {
    loading.value = false;
  }
}

async function handleVerifyCode() {
  await step2Ref.value?.validate();
  // 验证码正确性由后端在重置密码时统一校验，这里直接进入下一步
  step.value = 3;
}

async function handleResetPassword() {
  await step3Ref.value?.validate();
  loading.value = true;
  try {
    await AuthAPI.resetPassword({
      email: form.email,
      code: form.code,
      newPassword: form.newPassword,
    });
    ElMessage.success("密码重置成功，请重新登录");
    toLogin();
  } catch (err: any) {
    ElMessage.error(err?.message || "重置密码失败，请重试");
  } finally {
    loading.value = false;
  }
}

function checkCapsLock(event: KeyboardEvent) {
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
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

.reset-steps {
  margin-bottom: 0.5rem;

  :deep(.el-step__title) {
    font-size: 12px;
  }
}

.step-tip {
  display: block;
  margin-bottom: 0.75rem;
}
</style>
