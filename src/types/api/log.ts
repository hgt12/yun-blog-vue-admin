/**
 * Log 日志类型定义
 */

import type { BaseQueryParams } from "./common";

/** 日志分页查询参数 */
export interface LogQueryParams extends BaseQueryParams {
  /** 搜索关键字 */
  keywords?: string;
  /** 操作时间 */
  createTime?: [string, string];
}

/** 日志分页对象 */
export interface LogItem {
  /** 日志ID */
  id: string;
  /** 访问的页面URL（页面地址） */
  pageUrl: string;
  /** 来源页面（页面前地址） */
  referrer: string;
  /** 请求方法 */
  method?: string;
  /** IP地址 */
  ip: string;
  /** 页面标题 */
  pageTitle: string;
  /** 地区 */
  region: string;
  /** 浏览器 */
  browser: string;
  /** 终端系统 */
  os: string;
  /** 执行时间(毫秒) */
  executionTime: number;
  /** 访问时间 */
  visitTime?: string;
  /** 操作人 */
  operator: string;
  /** 设备类型 */
  deviceType: string;
}
