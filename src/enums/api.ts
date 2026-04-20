/**
 * API 相关枚举
 *
 * @description
 * 包含 API 响应码、请求状态等枚举定义
 */

/**
 * API 响应码枚举
 */
export const enum ApiCodeEnum {
  /**
   * 成功
   */
  SUCCESS = 200,

  /**
   * token失效 需要登录
   */
  NEED_LOGIN = 401,

  /**
   * 刷新令牌无效或过期
   */
  REFRESH_TOKEN_INVALID = 402,

  /**
   * 权限不足
   */
  NO_OPERATOR_AUTH = 403,
}
