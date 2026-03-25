<!--登录页面容器（壳）-->
<template>
  <div class="auth-view">
    <div class="auth-view__toolbar">
      <div class="toolbar-item">
        <ThemeSwitch />
      </div>
      <div class="toolbar-item">
        <LangSelect size="text-20px" />
      </div>
    </div>
    <!--登录上部显示区-->
    <div class="auth-view__wrapper">
      <section class="auth-panel">
        <div class="auth-panel__brand">
          <div class="auth-panel__meta">
            <div class="auth-panel__title-row">
              <span class="auth-panel__title">{{ appConfig.title }}</span>
            </div>
          </div>
        </div>

        <transition name="fade-slide" mode="out-in">
          <component :is="formComponents[component]" v-model="component" class="auth-panel__form" />
        </transition>

        <footer class="auth-panel__footer">
          <el-text size="small">
            Copyright © 2021 - 2025 youlai.tech
            <a href="http://beian.miit.gov.cn/" target="_blank">皖ICP备00064962号</a>
          </el-text>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appConfig } from "@/settings";
import ThemeSwitch from "@/components/ThemeSwitch/index.vue";

type LayoutMap = "login" | "resetPwd";

const component = ref<LayoutMap>("login");

const formComponents = {
  login: defineAsyncComponent(() => import("./components/Login.vue")),
  resetPwd: defineAsyncComponent(() => import("./components/ResetPwd.vue")),
};
</script>

<style lang="scss" scoped>
.auth-view {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
  background-color: #a5dff9;
}

.dark .auth-view {
  background-color: #008c9e;
}

.auth-view__toolbar {
  display: inline-flex;
  gap: 0.75rem;
  align-self: flex-end;
  padding: 0.5rem 0.75rem;
  background-color: rgba(245, 255, 250, 0.9);
  border: 1px solid rgba(48, 169, 222, 0.2);
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(48, 169, 222, 0.15);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 16px 40px rgba(48, 169, 222, 0.22);
    transform: translateY(-2px);
  }

  .toolbar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--el-fill-color);
    }
  }

  @media (max-width: 640px) {
    position: fixed;
    top: 12px;
    right: 16px;
    z-index: 20;
    align-self: flex-end;
    justify-content: center;
  }
}

/* 应用内暗黑主题下顶部设置面板的深色样式 */
.dark .auth-view__toolbar {
  background-color: rgba(37, 45, 56, 0.9);
  border-color: rgba(48, 169, 222, 0.3);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(48, 169, 222, 0.2) inset;
}

.auth-view__wrapper {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1.5rem, 3vw, 3rem);
  align-items: stretch;
  padding: clamp(1.5rem, 2vw, 2.5rem);
}

.auth-feature {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1.5rem, 3vw, 3rem);
  color: #3c4858;
  animation: featureFade 0.8s ease-out;
}

.dark .auth-feature {
  color: #c4c6c9;
}

@media (max-width: 768px) {
  .auth-view__wrapper {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 4rem 0.75rem 1.75rem;
  }

  .auth-feature {
    display: none;
  }

  .auth-panel {
    width: 100%;
    margin-inline: 0;
    box-shadow:
      0 12px 32px rgba(22, 93, 255, 0.18),
      0 2px 8px rgba(22, 93, 255, 0.12);
  }
}

.auth-feature__badge {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  width: fit-content;
  padding: 0.3rem 0.9rem;
  font-size: 0.875rem;
  color: #2f4154;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(48, 169, 222, 0.15);
  border-radius: 999px;
}

.dark .auth-feature__badge {
  color: #c4c6c9;
  background: rgba(48, 169, 222, 0.18);
}

.auth-feature__dot {
  width: 0.5rem;
  height: 0.5rem;
  background: #30a9de;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(48, 169, 222, 0.7);
}

.auth-feature__title {
  margin: 1.5rem 0 0.5rem;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 600;
  line-height: 1.2;
}

.auth-feature__subtitle {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.7;
  color: #718096;
}

.dark .auth-feature__subtitle {
  color: #a7a9ad;
}

.auth-feature__highlights {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    padding: 0.75rem 1rem;
    font-weight: 500;
    color: #3c4858;
    background: rgba(245, 255, 250, 0.9);
    border: 1px solid rgba(48, 169, 222, 0.15);
    border-radius: 12px;
    backdrop-filter: blur(6px);

    span {
      font-size: 0.75rem;
      line-height: 1.6;
      color: #30a9de;
    }
  }
}

.dark .auth-feature__highlights {
  li {
    color: #c4c6c9;
    background: rgba(37, 45, 56, 0.7);
    border-color: rgba(48, 169, 222, 0.2);

    span {
      color: #30a9de;
    }
  }
}

.auth-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-self: center;
  justify-content: flex-start;
  justify-self: end;
  width: min(420px, 100%);
  min-height: 560px;
  padding: clamp(1.5rem, 3vw, 2rem);
  margin-inline: auto;
  background: rgba(245, 255, 250, 0.95);
  border: 1px solid rgba(48, 169, 222, 0.15);
  border-radius: 24px;
  box-shadow:
    0 12px 15px rgba(0, 0, 0, 0.24),
    0 4px 16px rgba(48, 169, 222, 0.1),
    0 0 0 1px rgba(245, 255, 250, 0.6) inset;
  backdrop-filter: blur(20px);
  animation: panelLift 0.7s ease;
}

/* 应用内暗黑主题（例如 html/body 上挂 .dark 类）下的登录表单样式 */
.dark .auth-panel {
  background: rgba(37, 45, 56, 0.92);
  border-color: rgba(48, 169, 222, 0.25);
  box-shadow:
    0 12px 15px rgba(0, 0, 0, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(48, 169, 222, 0.12) inset;
}

.auth-panel__brand {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  padding-bottom: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(48, 169, 222, 0.12);
}

.dark .auth-panel__brand {
  border-color: rgba(48, 169, 222, 0.18);
}

.auth-panel__logo-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: radial-gradient(circle at 30% 20%, #f5fffa, #d0f0fb);
  border-radius: 18px;
  box-shadow:
    0 8px 20px rgba(48, 169, 222, 0.2),
    0 0 0 1px rgba(245, 255, 250, 0.8) inset;
}

.dark .auth-panel__logo-wrap {
  background: radial-gradient(circle at 30% 20%, #2f4154, #1f3144);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(48, 169, 222, 0.25) inset;
}

.auth-panel__logo {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.auth-panel__meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.35rem;
  align-items: center;
  min-width: 0;
}

.auth-panel__title-row {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.auth-panel__title {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  font-weight: 650;
  line-height: 1.4;
  color: var(--el-text-color-primary);
  text-align: center;
  white-space: nowrap;
}

.auth-panel__version-row {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.78rem;
}

.auth-panel__form {
  width: 100%;
  max-width: 100%;
  min-height: 360px;
  margin-inline: auto;

  :deep(.el-form-item) {
    margin-bottom: 1rem;
  }

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-border-color) inset;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    }
  }

  :deep(.el-card) {
    background: transparent;
    box-shadow: none;
  }
}

.auth-panel__footer {
  padding-top: 0.875rem;
  margin-top: 0.125rem;
  font-size: 0.875rem;
  text-align: center;
  border-top: 1px solid rgba(48, 169, 222, 0.1);

  a {
    margin-left: 0.25rem;
    color: #30a9de;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #2f4154;
    }
  }
}

.dark .auth-panel__footer {
  border-color: rgba(48, 169, 222, 0.15);

  a {
    color: #30a9de;

    &:hover {
      color: #a7a9ad;
    }
  }
}

@keyframes featureFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes panelLift {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-40px) scale(0.95);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}
</style>
