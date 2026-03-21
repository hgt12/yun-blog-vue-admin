import type { App } from "vue";
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layouts/index.vue");

// 博客管理路由（静态注册，无需后端菜单接口）
const blogRoutes: RouteRecordRaw = {
  path: "/blog",
  component: Layout,
  redirect: "/blog/post",
  name: "/blog",
  meta: { title: "博客管理", icon: "document", hidden: false },
  children: [
    {
      path: "post",
      name: "BlogPost",
      component: () => import("@/views/blog/post/index.vue"),
      meta: { title: "博客列表", icon: "el-icon-Reading", keepAlive: true },
    },
    {
      path: "write",
      name: "BlogWrite",
      component: () => import("@/views/blog/post/write.vue"),
      meta: { title: "写博客", icon: "el-icon-EditPen", hidden: false, keepAlive: false },
    },
    {
      path: "category",
      name: "BlogCategory",
      component: () => import("@/views/blog/category/index.vue"),
      meta: { title: "分类管理", icon: "el-icon-Collection", keepAlive: true },
    },
    {
      path: "tag",
      name: "BlogTag",
      component: () => import("@/views/blog/tag/index.vue"),
      meta: { title: "标签管理", icon: "el-icon-PriceTag", keepAlive: true },
    },
    {
      path: "link",
      name: "BlogLink",
      component: () => import("@/views/blog/link/index.vue"),
      meta: { title: "友链管理", icon: "el-icon-Link", keepAlive: true },
    },
  ],
};

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
        // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error/404.vue"),
        meta: { hidden: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "个人中心", icon: "user", hidden: true },
      },
      {
        path: "my-notice",
        name: "MyNotice",
        component: () => import("@/views/profile/notice/index.vue"),
        meta: { title: "我的通知", icon: "user", hidden: true },
      },
      {
        path: "/detail/:id(\\d+)",
        name: "DemoDetail",
        component: () => import("@/views/demo/detail.vue"),
        meta: { title: "详情页缓存", icon: "user", hidden: true, keepAlive: true },
      },
    ],
  },
  blogRoutes,
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
