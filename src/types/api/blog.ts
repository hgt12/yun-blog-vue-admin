/**
 * Blog 博客类型定义
 */

import type { BaseQueryParams } from "./common";

// ==================== 博客文章 ====================

/** 博客文章查询参数 */
export interface BlogPostQueryParams extends BaseQueryParams {
  keywords?: string;
  categoryId?: string;
  tagId?: string;
  status?: string;
}

/** 博客文章列表项 */
export interface BlogPostItem {
  id?: string;
  title?: string;
  summary?: string;
  thumbnail?: string;
  categoryId?: string;
  categoryName?: string;
  tagNames?: string;
  tags?: Array<{ id: string; name: string; createTime?: string }>;
  author?: string;
  status?: string;
  viewCount?: number;
  createTime?: string;
  updateTime?: string;
}

/** 博客文章表单 */
export interface BlogPostForm {
  id?: string;
  title: string;
  summary?: string;
  thumbnail?: string;
  content: string;
  categoryId: string;
  categoryName?: string;
  tags?: string[];
  status: string;
  isTop?: string;
  isComment?: string;
}

// ==================== 分类 ====================

/** 分类查询参数 */
export interface BlogCategoryQueryParams extends BaseQueryParams {
  keywords?: string;
}

/** 分类列表项 */
export interface BlogCategoryItem {
  id?: string;
  name?: string;
  sort?: number;
  postCount?: number;
  createTime?: string;
}

/** 分类表单 */
export interface BlogCategoryForm {
  id?: string;
  name: string;
  sort?: number;
}

// ==================== 标签 ====================

/** 标签查询参数 */
export interface BlogTagQueryParams extends BaseQueryParams {
  keywords?: string;
}

/** 标签列表项 */
export interface BlogTagItem {
  id?: string;
  name?: string;
  articleCount?: number;
  createTime?: string;
}

/** 标签表单 */
export interface BlogTagForm {
  id?: string;
  name: string;
}

// ==================== 友链 ====================

/** 友链查询参数 */
export interface BlogLinkQueryParams extends BaseQueryParams {
  keywords?: string;
  status?: string;
}

/** 友链列表项 */
export interface BlogLinkItem {
  id?: string;
  name?: string;
  url?: string;
  logoUrl?: string;
  description?: string;
  status?: string;
  sort?: number;
  createTime?: string;
}

/** 友链表单 */
export interface BlogLinkForm {
  id?: string;
  name: string;
  url: string;
  logoUrl?: string;
  description?: string;
  status: string;
  sort?: number;
}
