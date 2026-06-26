import request from "@/utils/request";
import type {
  LoginRequest,
  LoginResponse,
  CaptchaInfo,
  SendCodeRequest,
  VerifyCodeRequest,
  ResetPasswordRequest,
} from "@/types/api/auth";

const AUTH_BASE_URL = "/auth";

const AuthAPI = {
  /** 登录接口*/
  login(data: LoginRequest) {
    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/login`,
      method: "post",
      data: {
        username: data.username,
        password: data.password,
        captchaId: data.captchaId,
        captchaCode: data.captchaCode,
      },
    });
  },

  /** 刷新 token 接口*/
  refreshToken(refreshToken: string) {
    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/refreshToken`,
      method: "post",
      params: { refreshToken },
      headers: {
        token: "no-auth",
      },
    });
  },

  /** 退出登录接口 */
  logout() {
    return request({
      url: `${AUTH_BASE_URL}/logout`,
      method: "post",
    });
  },

  /** 获取验证码接口*/
  getCaptcha() {
    return request<any, CaptchaInfo>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  },

  /** 发送验证码（忘记密码） */
  sendCode(data: SendCodeRequest, captchaToken?: string) {
    return request({
      url: `${AUTH_BASE_URL}/sendCode`,
      method: "post",
      data,
      ...(captchaToken ? { params: { captchaToken } } : {}),
    });
  },

  /** 验证验证码 */
  verifyCode(data: VerifyCodeRequest) {
    return request({
      url: `${AUTH_BASE_URL}/verifyCode`,
      method: "post",
      data,
    });
  },

  /** 重置密码 */
  resetPassword(data: ResetPasswordRequest) {
    return request({
      url: `${AUTH_BASE_URL}/resetPassword`,
      method: "post",
      data,
    });
  },
};

export default AuthAPI;
