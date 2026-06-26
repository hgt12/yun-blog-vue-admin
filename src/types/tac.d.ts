/**
 * tianai-captcha (TAC) 滑块验证码全局类型声明
 */

/** TAC 验证码配置 */
export interface TacConfig {
  /** 请求验证码数据接口 */
  requestCaptchaDataUrl: string;
  /** 验证验证码接口 */
  validCaptchaUrl: string;
  /** 绑定的 DOM 元素选择器 */
  bindEl: string;
  /** 自定义请求头 */
  requestHeaders?: Record<string, string>;
  /** 验证成功回调 */
  validSuccess?: (res: TacResponse, c: any, tac: TacInstance) => void;
  /** 验证失败回调 */
  validFail?: (res: TacResponse, c: any, tac: TacInstance) => void;
  /** 关闭按钮回调 */
  btnCloseFun?: (t: any, tac: TacInstance) => void;
  /** 刷新按钮回调 */
  btnRefreshFun?: (t: any, tac: TacInstance) => void;
  /** 超时时间（毫秒），默认 10000 */
  timeout?: number;
  /** TAC SDK 运行时添加：请求验证码数据的函数（由 requestCaptchaDataUrl 生成） */
  requestCaptchaData?: () => Promise<any>;
}

/** TAC 验证码实例 */
export interface TacInstance {
  /** TAC 配置（含运行时方法） */
  config: TacConfig & { __originalRequestCaptchaData?: () => Promise<any> };
  /** 初始化并展示验证码 */
  init: () => void;
  /** 销毁验证码窗口 */
  destroyWindow: () => void;
}

/** TAC 验证码响应 */
export interface TacResponse {
  /** 响应码，200 表示成功 */
  code: number;
  /** 响应消息 */
  msg?: string;
  /** 响应数据 */
  data: {
    /** 验证码ID */
    id?: string;
    /** 二次验证 Token */
    token?: string;
  };
}

/** TAC 初始化函数类型 */
export type InitTacFunction = (tacPath: string, config: TacConfig) => Promise<TacInstance>;

declare global {
  interface Window {
    /** 加载并初始化 TAC 验证码 */
    initTAC: InitTacFunction;
    /** 加载验证码脚本（底层 API） */
    loadTAC: (url: string | { url: string }, el: any, config: TacConfig) => Promise<TacInstance>;
    /** 加载验证码脚本（底层 API） */
    loadCaptchaScript: (config: any, el: any, tConfig: any, resolve: any, reject: any) => void;
  }
}

export {};
