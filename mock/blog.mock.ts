import { defineMock } from "./base";

export default defineMock([
  // ==================== 文章 ====================
  {
    url: "blog/posts",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        list: [
          {
            id: "1",
            title: "Vue3 + TypeScript 最佳实践",
            summary: "本文介绍 Vue3 与 TypeScript 结合使用的最佳实践",
            categoryName: "前端开发",
            tagNames: "Vue3,TypeScript",
            author: "admin",
            status: 1,
            viewCount: 1280,
            createTime: "2026-01-10 10:00:00",
          },
          {
            id: "2",
            title: "Spring Boot 微服务架构设计",
            summary: "深入讲解 Spring Boot 微服务架构的设计思路",
            categoryName: "后端开发",
            tagNames: "Java,Spring Boot",
            author: "admin",
            status: 1,
            viewCount: 960,
            createTime: "2026-01-15 14:30:00",
          },
          {
            id: "3",
            title: "Docker 容器化部署实战",
            summary: "从零开始学习 Docker 容器化部署",
            categoryName: "运维",
            tagNames: "Docker,DevOps",
            author: "admin",
            status: 0,
            viewCount: 540,
            createTime: "2026-02-01 09:00:00",
          },
          {
            id: "4",
            title: "MySQL 性能优化指南",
            summary: "全面介绍 MySQL 数据库性能优化方法",
            categoryName: "数据库",
            tagNames: "MySQL",
            author: "admin",
            status: 1,
            viewCount: 2100,
            createTime: "2026-02-20 16:00:00",
          },
        ],
        total: 4,
      },
      msg: "一切ok",
    },
  },
  {
    url: "posts/:id/form",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        id: "1",
        title: "Vue3 + TypeScript 最佳实践",
        summary: "本文介绍 Vue3 与 TypeScript 结合使用的最佳实践",
        content: "<p>正文内容...</p>",
        categoryId: "1",
        tagIds: ["1", "2"],
        status: 1,
      },
      msg: "一切ok",
    },
  },
  {
    url: "posts",
    method: ["POST"],
    body: { code: "00000", data: null, msg: "新增成功" },
  },
  {
    url: "posts/:id",
    method: ["PUT"],
    body: { code: "00000", data: null, msg: "修改成功" },
  },
  {
    url: "posts/:id",
    method: ["DELETE"],
    body: { code: "00000", data: null, msg: "删除成功" },
  },

  // ==================== 分类 ====================
  {
    url: "categories",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        list: [
          { id: "1", name: "前端开发", sort: 1, postCount: 12, createTime: "2025-12-01 10:00:00" },
          { id: "2", name: "后端开发", sort: 2, postCount: 8, createTime: "2025-12-01 10:00:00" },
          { id: "3", name: "数据库", sort: 3, postCount: 5, createTime: "2025-12-01 10:00:00" },
          { id: "4", name: "运维", sort: 4, postCount: 3, createTime: "2025-12-01 10:00:00" },
        ],
        total: 4,
      },
      msg: "一切ok",
    },
  },
  {
    url: "categories/options",
    method: ["GET"],
    body: {
      code: "00000",
      data: [
        { value: "1", label: "前端开发" },
        { value: "2", label: "后端开发" },
        { value: "3", label: "数据库" },
        { value: "4", label: "运维" },
      ],
      msg: "一切ok",
    },
  },
  {
    url: "categories/:id/form",
    method: ["GET"],
    body: { code: "00000", data: { id: "1", name: "前端开发", sort: 1 }, msg: "一切ok" },
  },
  {
    url: "categories",
    method: ["POST"],
    body: { code: "00000", data: null, msg: "新增成功" },
  },
  {
    url: "categories/:id",
    method: ["PUT"],
    body: { code: "00000", data: null, msg: "修改成功" },
  },
  {
    url: "categories/:id",
    method: ["DELETE"],
    body: { code: "00000", data: null, msg: "删除成功" },
  },

  // ==================== 标签 ====================
  {
    url: "tags",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        list: [
          { id: "1", name: "Vue3", postCount: 8, createTime: "2025-12-01 10:00:00" },
          { id: "2", name: "TypeScript", postCount: 6, createTime: "2025-12-01 10:00:00" },
          { id: "3", name: "Java", postCount: 5, createTime: "2025-12-01 10:00:00" },
          { id: "4", name: "Spring Boot", postCount: 4, createTime: "2025-12-01 10:00:00" },
          { id: "5", name: "MySQL", postCount: 3, createTime: "2025-12-01 10:00:00" },
          { id: "6", name: "Docker", postCount: 2, createTime: "2025-12-01 10:00:00" },
        ],
        total: 6,
      },
      msg: "一切ok",
    },
  },
  {
    url: "tags/options",
    method: ["GET"],
    body: {
      code: "00000",
      data: [
        { value: "1", label: "Vue3" },
        { value: "2", label: "TypeScript" },
        { value: "3", label: "Java" },
        { value: "4", label: "Spring Boot" },
        { value: "5", label: "MySQL" },
        { value: "6", label: "Docker" },
      ],
      msg: "一切ok",
    },
  },
  {
    url: "tags/:id/form",
    method: ["GET"],
    body: { code: "00000", data: { id: "1", name: "Vue3" }, msg: "一切ok" },
  },
  {
    url: "tags",
    method: ["POST"],
    body: { code: "00000", data: null, msg: "新增成功" },
  },
  {
    url: "tags/:id",
    method: ["PUT"],
    body: { code: "00000", data: null, msg: "修改成功" },
  },
  {
    url: "tags/:id",
    method: ["DELETE"],
    body: { code: "00000", data: null, msg: "删除成功" },
  },

  // ==================== 友链 ====================
  {
    url: "links",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        list: [
          {
            id: "1",
            name: "有来开源",
            url: "https://gitee.com/youlaiorg",
            logoUrl: "",
            description: "有来开源组织官网",
            status: 1,
            sort: 1,
            createTime: "2025-12-01 10:00:00",
          },
          {
            id: "2",
            name: "Vue 官网",
            url: "https://vuejs.org",
            logoUrl: "",
            description: "Vue.js 官方文档",
            status: 1,
            sort: 2,
            createTime: "2025-12-01 10:00:00",
          },
          {
            id: "3",
            name: "Element Plus",
            url: "https://element-plus.org",
            logoUrl: "",
            description: "Element Plus 组件库",
            status: 1,
            sort: 3,
            createTime: "2025-12-01 10:00:00",
          },
          {
            id: "4",
            name: "待审核站点",
            url: "https://example.com",
            logoUrl: "",
            description: "待审核的友链",
            status: 0,
            sort: 4,
            createTime: "2026-01-05 10:00:00",
          },
        ],
        total: 4,
      },
      msg: "一切ok",
    },
  },
  {
    url: "links/:id/form",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        id: "1",
        name: "有来开源",
        url: "https://gitee.com/youlaiorg",
        logoUrl: "",
        description: "有来开源组织官网",
        status: 1,
        sort: 1,
      },
      msg: "一切ok",
    },
  },
  {
    url: "links",
    method: ["POST"],
    body: { code: "00000", data: null, msg: "新增成功" },
  },
  {
    url: "links/:id",
    method: ["PUT"],
    body: { code: "00000", data: null, msg: "修改成功" },
  },
  {
    url: "links/:id",
    method: ["DELETE"],
    body: { code: "00000", data: null, msg: "删除成功" },
  },
]);
