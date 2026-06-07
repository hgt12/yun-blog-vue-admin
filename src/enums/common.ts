/**
 * 通用枚举
 *
 * @description
 * 包含对话框模式、通用状态等跨业务的枚举定义
 */

/**
 * 对话框模式枚举
 *
 * @description
 * 定义对话框的操作模式（创建、编辑、查看）
 */
export enum DialogMode {
  /** 创建模式 - 新增数据 */
  CREATE = "create",
  /** 编辑模式 - 修改数据 */
  EDIT = "edit",
  /** 查看模式 - 只读展示 */
  VIEW = "view",
}

/**
 * 通用状态枚举
 *
 * @description
 * 适用于大多数业务实体的启用/禁用状态
 */
export enum CommonStatus {
  /** 禁用 */
  DISABLED = "1",
  /** 启用 */
  ENABLED = "0",
}

/**
 * 审核状态枚举
 */
export enum AuditStatus {
  /** 正常 */
  NORMAL = "0",
  /** 待审核 */
  PENDING_REVIEW = "1",
  /** 审核未通过 */
  REVIEW_NOT_PASSED = "2",
}

/**
 * 文章状态枚举
 */
export enum ArticleStatus {
  /** 已发布 */
  PUBLISHED = "0",
  /** 草稿 */
  DRAFT = "1",
}

/**
 * 文章内容类型
 */
export enum ArticleContentType {
  /** HTML 富文本 */
  HTML = "0",
  /** Markdown */
  MARKDOWN = "1",
}

/**
 * 文章是否置顶
 */
export enum ArticleTopStatus {
  /** 不置顶 */
  NOT_TOP = "0",
  /** 置顶 */
  IS_TOP = "1",
}

/**
 * 文章是否允许评论
 */
export enum ArticleCommentStatus {
  /** 不允许评论 */
  NOT_COMMENT = "0",
  /** 允许评论 */
  IS_COMMENT = "1",
}

/**
 * 友链状态枚举
 */
export enum LinkStatus {
  /** 启用 */
  ENABLED = "0",
  /** 弃用 */
  DISABLED = "1",
}

/**
 * 评论类型枚举
 */
export enum CommentType {
  /** 文章评论 */
  ARTICLE = "0",
  /** 友链留言 */
  LINK = "1",
  /** 留言板 */
  MESSAGE_BOARD = "2",
}
