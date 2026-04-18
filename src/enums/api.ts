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
   * 访问令牌无效或过期
   */
  ACCESS_TOKEN_INVALID = 10230,

  /**
   * 刷新令牌无效或过期
   */
  REFRESH_TOKEN_INVALID = 10231,

  /**
   * 需要登录
   */
  NEED_LOGIN = 401,

  /**
   * 权限不足
   */
  NO_OPERATOR_AUTH = 403,
}
