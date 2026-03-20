import request from "@/utils/request";
import type {
  LoginRequest,
  LoginResponse,
  CaptchaInfo,
  RegisterRequest,
  SendCodeRequest,
  ResetPasswordRequest,
  PhoneCodeLoginRequest,
  EmailCodeLoginRequest,
} from "@/types/api/auth";

const AUTH_BASE_URL = "/api/v1/auth";

const AuthAPI = {
  /** 登录接口*/
  login(data: LoginRequest) {
    const payload: Record<string, any> = {
      username: data.username,
      password: data.password,
      captchaId: data.captchaId,
      captchaCode: data.captchaCode,
    };

    // tenantId is optional — include only when provided (multi-tenant feature)
    if (typeof data.tenantId !== "undefined") {
      payload.tenantId = data.tenantId;
    }

    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/login`,
      method: "post",
      data: payload,
    });
  },

  /** 切换租户(平台用户) - 返回新的 token */
  switchTenant(tenantId: number) {
    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/switch-tenant`,
      method: "post",
      params: { tenantId },
    });
  },

  /** 刷新 token 接口*/
  refreshToken(refreshToken: string) {
    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/refresh-token`,
      method: "post",
      params: { refreshToken },
      headers: {
        Authorization: "no-auth",
      },
    });
  },

  /** 退出登录接口 */
  logout() {
    return request({
      url: `${AUTH_BASE_URL}/logout`,
      method: "delete",
    });
  },

  /** 获取验证码接口*/
  getCaptcha() {
    return request<any, CaptchaInfo>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  },

  /** 注册接口 */
  register(data: RegisterRequest) {
    return request({
      url: `${AUTH_BASE_URL}/register`,
      method: "post",
      data,
    });
  },

  /** 发送验证码（注册/忘记密码） */
  sendCode(data: SendCodeRequest) {
    return request({
      url: `${AUTH_BASE_URL}/send-code`,
      method: "post",
      data,
    });
  },

  /** 重置密码 */
  resetPassword(data: ResetPasswordRequest) {
    return request({
      url: `${AUTH_BASE_URL}/reset-password`,
      method: "post",
      data,
    });
  },

  /** 手机验证码登录 */
  loginByPhone(data: PhoneCodeLoginRequest) {
    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/login/phone`,
      method: "post",
      data,
    });
  },

  /** 邮箱验证码登录 */
  loginByEmail(data: EmailCodeLoginRequest) {
    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/login/email`,
      method: "post",
      data,
    });
  },
};

export default AuthAPI;
