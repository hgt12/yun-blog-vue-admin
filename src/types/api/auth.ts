/**
 * 认证相关类型定义
 */

/**
 * 登录请求参数
 */
export interface LoginRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码缓存key */
  captchaId?: string;
  /** 验证码 */
  captchaCode?: string;
  /** 记住我 */
  rememberMe?: boolean;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 令牌类型 */
  tokenType: string;
  /** 过期时间(单位:秒) */
  expiresIn: number;
}

/**
 * 验证码响应
 */
export interface CaptchaInfo {
  /** 验证码缓存key */
  captchaId: string;
  /** 验证码图片Base64 */
  captchaBase64: string;
}

/**
 * 发送验证码请求
 */
export interface SendCodeRequest {
  /** 邮箱或手机号 */
  account: string;
  /** 业务类型：FORGOT_PASSWORD | LOGIN */
  type: string;
}

/**
 * 重置密码请求
 */
export interface ResetPasswordRequest {
  /** 邮箱 */
  email: string;
  /** 验证码 */
  code: string;
  /** 新密码 */
  newPassword: string;
}
