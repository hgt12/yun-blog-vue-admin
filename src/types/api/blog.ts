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
  categoryName?: string;
  categoryStatus?: string;
  tags?: Array<{ id: string; name: string; status?: string; createTime?: string }>;
  status?: string;
  viewCount?: number;
  createTime?: string;
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
  status?: string;
}

/** 分类列表项 */
export interface BlogCategoryItem {
  id?: string;
  name?: string;
  description?: string;
  sort?: number;
  articleCount?: number;
  status?: string;
  createTime?: string;
}

/** 分类表单 */
export interface BlogCategoryForm {
  id?: string;
  name: string;
  description?: string;
  sort?: number;
  status: string;
}

// ==================== 标签 ====================

/** 标签查询参数 */
export interface BlogTagQueryParams extends BaseQueryParams {
  keywords?: string;
  status?: string;
}

/** 标签列表项 */
export interface BlogTagItem {
  id?: string;
  name?: string;
  remark?: string;
  articleCount?: number;
  status?: string;
  sort?: number;
  createTime?: string;
}

/** 标签表单 */
export interface BlogTagForm {
  id?: string;
  name: string;
  remark?: string;
  status: string;
  sort?: number;
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
  address?: string;
  logo?: string;
  description?: string;
  status?: string;
  sort?: number;
  createTime?: string;
}

/** 友链表单 */
export interface BlogLinkForm {
  id?: string;
  name: string;
  address: string;
  logo?: string;
  description?: string;
  status: string;
  sort?: number;
}

// ==================== 评论 ====================

/** 评论查询参数 */
export interface BlogCommentQueryParams extends BaseQueryParams {
  keywords?: string;
  type?: string;
  status?: string;
  articleId?: string;
  startTime?: string;
  endTime?: string;
}

/** 评论列表项 */
export interface BlogCommentItem {
  id?: string;
  type?: string;
  articleId?: string;
  articleTitle?: string;
  userId?: string;
  nickname?: string;
  email?: string;
  personalWebsite?: string;
  content?: string;
  rootId?: string;
  replyToNickname?: string;
  likeCount?: number;
  status?: string;
  createTime?: string;
  children?: BlogCommentItem[];
}

/** 评论表单 */
export interface BlogCommentForm {
  id?: string;
  type?: string;
  articleId?: string;
  userId?: string;
  nickname?: string;
  email?: string;
  personalWebsite?: string;
  avatar?: string;
  content: string;
  parentId?: string;
  rootId?: string;
  replyToUserId?: string;
  replyToCommentId?: string;
  status?: string;
}

/** 评论统计 */
export interface BlogCommentStatistics {
  total?: number;
  pendingReview?: number;
  todayCount?: number;
  rejected?: number;
}
