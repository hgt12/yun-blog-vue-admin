/**
 * 图形验证码 Composable（单例模式）
 *
 * 基于 tianai-captcha "后端先行"策略：
 * 1. 调用 show() 弹出滑块验证码
 * 2. 用户完成滑块验证 → 返回 token
 * 3. 用户取消或失败 → 返回 null
 *
 * 使用示例：
 *   const { show } = useCaptcha()
 *   const token = await show()
 *   if (token) {
 *     await sendMobileCode(mobile, token)
 *   }
 */
import { ref } from "vue";

// ========== 模块级状态（全局单例） ==========
const visible = ref(false);
const errorMessage = ref("");

// 当前等待的 Promise resolver
let pendingResolver: ((token: string | null) => void) | null = null;

export function useCaptcha() {
  /**
   * 弹出图形验证码，等待用户完成验证
   * @returns 验证成功返回 token，取消或失败返回 null
   */
  async function show(): Promise<string | null> {
    // 如果已有等待中的 Promise，先取消旧的
    if (pendingResolver) {
      pendingResolver(null);
      pendingResolver = null;
    }

    errorMessage.value = "";

    return new Promise((resolve) => {
      pendingResolver = resolve;
      visible.value = true;
    });
  }

  /**
   * 验证码校验成功，传递 token 并关闭弹窗
   */
  function resolveWithToken(token: string) {
    visible.value = false;
    if (pendingResolver) {
      pendingResolver(token);
      pendingResolver = null;
    }
  }

  /**
   * 用户取消验证码
   */
  function cancel() {
    visible.value = false;
    if (pendingResolver) {
      pendingResolver(null);
      pendingResolver = null;
    }
  }

  /**
   * 设置错误信息（由 CaptchaModal 调用）
   */
  function setError(msg: string) {
    errorMessage.value = msg;
  }

  return {
    visible,
    errorMessage,
    show,
    resolveWithToken,
    cancel,
    setError,
  };
}
