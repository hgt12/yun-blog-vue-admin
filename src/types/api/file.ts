/**
 * File 文件相关类型定义
 */

/** 文件信息 */
export interface FileInfo {
  /** 文件名称 */
  name: string;
  /** 文件URL */
  url: string;
}

/** 文件资源记录 */
export interface FileItem {
  id: string;
  name: string;
  fileSource?: string;
  filePath?: string;
  url: string;
  size?: number;
  mimeType?: string;
  delFlag?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

/** 文件资源查询参数 */
export interface FileQueryParams {
  pageNum: number;
  pageSize: number;
  keywords?: string;
  fileSource?: string;
  dateRange?: string[];
}
