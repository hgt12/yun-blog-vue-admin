<template>
  <!-- 图形验证码弹窗（无 Bootstrap 依赖，纯手写 CSS） -->
  <div v-if="captcha.visible.value" class="captcha-overlay" @click.self="handleOverlayClick">
    <div class="captcha-dialog">
      <div class="captcha-header">
        <h4 class="captcha-title">请完成安全验证</h4>
        <button type="button" class="captcha-close" aria-label="Close" @click="handleCancel">
          &times;
        </button>
      </div>
      <div class="captcha-body">
        <!-- 错误提示 -->
        <div v-if="captcha.errorMessage.value" class="captcha-error">
          {{ captcha.errorMessage.value }}
        </div>
        <!-- tianai-captcha 滑块验证码容器 -->
        <div id="tianai-captcha-container" class="captcha-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from "vue";
import { useCaptcha } from "@/composables/useCaptcha";
import type { TacInstance } from "@/types/tac";

const captcha = useCaptcha();

let tacInstance: TacInstance | null = null;
let isDestroying = false;

watch(
  () => captcha.visible.value,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        initCaptcha();
      }, 150);
    } else {
      destroyCaptcha();
    }
  }
);

// 从 localStorage/sessionStorage 读取 token 构建请求头
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { token } : {};
}

// 拦截 TAC 的 requestCaptchaData 方法，解包后端的 { code, data } 响应格式
function interceptCaptchaResponse(tac: TacInstance) {
  if (!tac || !tac.config) return;
  if (tac.config.__originalRequestCaptchaData) return;

  const original = tac.config.requestCaptchaData;
  if (!original || typeof original !== "function") return;

  tac.config.__originalRequestCaptchaData = original;

  const bound = original.bind(tac.config);
  tac.config.requestCaptchaData = function () {
    return bound()
      .then((raw: any) => {
        if (raw && raw.data) {
          const unwrapped = raw.data;
          if (!unwrapped.captcha && unwrapped.type) {
            const { id, ...captchaFields } = unwrapped;
            const wrapped = { id, captcha: captchaFields };
            return wrapped;
          }
          return unwrapped;
        }
        return raw;
      })
      .catch((err: any) => {
        console.error("[Captcha] 获取验证码数据失败:", err);
        throw err;
      });
  };
}

function initCaptcha() {
  destroyCaptcha();
  isDestroying = false;

  const container = document.getElementById("tianai-captcha-container");
  if (!container) {
    captcha.setError("验证码容器加载失败，请刷新重试");
    return;
  }

  container.innerHTML = "";

  const config = {
    requestCaptchaDataUrl: "/api/genCaptcha",
    validCaptchaUrl: "/api/check",
    bindEl: "#tianai-captcha-container",
    requestHeaders: getAuthHeaders(),
    validSuccess: (res: any, _captchaInstance: any, tac: TacInstance) => {
      const token = res?.data?.token;
      if (token) {
        captcha.resolveWithToken(token);
      } else {
        captcha.setError("验证通过但未获取到凭证，请重试");
      }
      if (tac && !isDestroying) {
        try {
          tac.destroyWindow();
        } catch {
          // ignore
        }
      }
      tacInstance = null;
    },
    btnCloseFun: (_t: any, tac: TacInstance) => {
      void _t;
      try {
        tac.destroyWindow();
      } catch {
        // ignore
      }
      tacInstance = null;
      captcha.cancel();
    },
  };

  if (typeof window.initTAC !== "function") {
    captcha.setError("验证码组件加载失败，请检查网络后刷新重试");
    return;
  }

  window
    .initTAC("/static/tac", config)
    .then((tac: TacInstance) => {
      if (isDestroying) {
        try {
          tac.destroyWindow();
        } catch {
          // ignore
        }
        return;
      }
      tacInstance = tac;
      interceptCaptchaResponse(tac);

      try {
        tac.init();
      } catch (err) {
        console.error("验证码初始化 init() 失败:", err);
        if (!isDestroying) {
          captcha.setError("验证码初始化失败，请刷新重试");
        }
      }
    })
    .catch((err: any) => {
      console.error("图形验证码初始化失败:", err);
      if (!isDestroying) {
        captcha.setError("验证码加载失败，请刷新重试");
      }
    });
}

function destroyCaptcha() {
  isDestroying = true;
  if (tacInstance) {
    try {
      tacInstance.destroyWindow();
    } catch {
      // ignore
    }
    tacInstance = null;
  }
  const container = document.getElementById("tianai-captcha-container");
  if (container) {
    container.innerHTML = "";
  }
}

function handleCancel() {
  destroyCaptcha();
  captcha.cancel();
}

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    handleCancel();
  }
}

onBeforeUnmount(() => {
  destroyCaptcha();
});
</script>

<style>
/* ========== 验证码弹窗：居中弹出，淡入淡出（不从侧边滑入） ========== */

/* 遮罩层：全屏半透明黑底，淡入（z-index 需高于 el-dialog 的 2000+） */
.captcha-overlay {
  position: fixed;
  inset: 0;
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  animation: captcha-overlay-fadein 0.2s ease;
}

@keyframes captcha-overlay-fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 弹窗主体：居中 + 缩放淡入，不从侧边滑入 */
.captcha-dialog {
  position: relative;
  z-index: 1051;
  width: 380px;
  max-width: 95vw;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  animation: captcha-dialog-pop 0.25s ease;
}

@keyframes captcha-dialog-pop {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 头部 */
.captcha-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 18px;
  border-bottom: 1px solid #eee;
}

.captcha-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.captcha-close {
  position: absolute;
  top: 50%;
  right: 14px;
  padding: 0;
  font-size: 24px;
  line-height: 1;
  color: #999;
  cursor: pointer;
  background: none;
  border: none;
  transform: translateY(-50%);
  transition: color 0.2s;
}

.captcha-close:hover {
  color: #333;
}

/* 内容区 */
.captcha-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 340px;
  padding: 16px 18px;
}

.captcha-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
}

.captcha-error {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #721c24;
  text-align: center;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>
