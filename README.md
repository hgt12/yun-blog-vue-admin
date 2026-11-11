# yun-blog-vue-admin

> 个人博客系统的后台管理前端，基于 Vue 3 + TypeScript + Vite + Element Plus 构建。

`yun-blog-vue-admin` 是一个前后端分离的个人博客后台管理单页应用（SPA），主要面向博客站长使用，提供文章内容管理、评论审核、友链维护、系统权限配置、站点配置、文件管理、通知公告等功能。项目通过 HTTP API 与 `yun-blog-java` 后端通信，并通过 STOMP over WebSocket 获取字典变更和在线人数等实时数据。

- 前端仓库：<https://github.com/hgt12/yun-blog-vue-admin.git>
- 配套后端：<https://github.com/hgt12/yun-blog_java>
- 当前版本：`4.3.0`（见 `package.json`）

> 说明：本仓库仅包含**后台管理端**，不包含前台博客展示页面；前台博客需另行部署。

## 功能特性

| 模块 | 主要功能 |
| --- | --- |
| 数据看板 | 问候语与天气背景、后台/前台在线人数实时统计（WebSocket）、访客 UV/PV 概览、近 7/30 天访问趋势图、最近访问记录 |
| 博客管理 | 文章列表与筛选、写博客/编辑文章（富文本与 Markdown 双编辑器）、分类管理、标签管理、评论审核/回复/导出、友链管理 |
| 系统管理 | 用户管理（部门树、导入导出、重置密码、头像审核）、角色管理（菜单权限分配）、菜单管理、部门管理、字典管理（含字典数据与实时同步）、系统配置（前台/后台配置、缓存刷新）、通知公告（发布/撤回）、访问日志（导出）、文件管理（上传/预览/下载/删除） |
| 个人中心 | 个人资料与头像修改、修改密码、绑定/更换手机号、绑定/更换邮箱（tianai-captcha 滑块验证） |
| 通知中心 | 顶部通知下拉、未读数量统计、全部已读、我的通知列表与详情 |
| 登录认证 | 账号密码登录、图形验证码、记住我、邮箱找回密码；JWT accessToken + refreshToken 自动续期；后端动态菜单路由与 `v-hasPerm` 按钮级权限 |
| 通用能力 | 左侧/顶部/混合多布局、主题色与暗黑模式、标签页、国际化（中/英）、全屏、命令面板（`Ctrl + K` 搜索菜单）、水印、页面切换动画 |

## 技术栈

| 分类 | 技术 | 版本/说明 |
| --- | --- | --- |
| 开发语言 | TypeScript | `^5.9.3` |
| 核心框架 | Vue | `^3.5.30`（Composition API + `<script setup>`） |
| 构建工具 | Vite | `^6.4.1` |
| UI 组件库 | Element Plus | `^2.13.5`，搭配 `@element-plus/icons-vue` |
| 状态管理 | Pinia | `^3.0.4` |
| 路由 | Vue Router | `^5.0.3`（当前使用 hash 模式） |
| HTTP 客户端 | Axios | `^1.13.6` |
| 样式方案 | Sass + UnoCSS + animate.css | SCSS 变量、原子化样式与动画 |
| 图表 | ECharts | `^6.0.0` |
| 富文本编辑 | WangEditor Next | `^5.6.49` |
| Markdown 编辑 | md-editor-v3 + CodeMirror | `^6.4.0` / `^5.65.21` |
| 表格 | vxe-table | `~4.6.25` |
| 实时通信 | @stomp/stompjs | `^7.3.0`（STOMP over WebSocket） |
| 国际化 | vue-i18n | `^11.3.0` |
| 工具库 | VueUse、lodash-es、qs、ExcelJS | 组合式工具、数据处理与 Excel 导出 |
| 测试 | Vitest + Vue Test Utils + happy-dom | `^4.1.0` |
| 代码规范 | ESLint + Prettier + Stylelint + Husky + lint-staged | 提交前自动检查与格式化 |

## 目录结构

```text
yun-blog-vue-admin/
├── public/
│   ├── static/load.min.js        # tianai-captcha SDK 加载器
│   ├── static/tac/               # tianai-captcha 的 JS/CSS/图片资源及 Apache-2.0 许可证
│   └── img/                      # 登录背景、默认头像等图片
├── src/
│   ├── api/
│   │   ├── auth.ts               # 登录、验证码、Token 刷新、找回密码
│   │   ├── blog/                 # 文章/分类/标签/评论/友链接口
│   │   └── system/               # 用户/角色/菜单/部门/字典/配置/通知/日志/统计
│   ├── components/               # CURD、编辑器、验证码弹窗、通知、上传、分页等通用组件
│   ├── composables/              # WebSocket/STOMP、验证码、天气背景、表格选择等组合式函数
│   ├── directives/               # v-hasPerm 按钮权限指令
│   ├── layouts/                  # 左侧/顶部/混合布局、标签页、设置面板
│   ├── router/
│   │   ├── index.ts              # 路由入口（hash 模式）
│   │   └── guards/permission.ts  # 登录校验、动态路由与访问统计
│   ├── store/modules/            # Pinia：user/permission/dict/settings/site-config 等
│   ├── styles/                   # 全局 SCSS、Element Plus、VXE Table 样式
│   ├── utils/                    # Axios 封装、鉴权、存储、格式化、校验
│   ├── views/
│   │   ├── dashboard/            # 数据看板
│   │   ├── blog/                 # 写博客、文章、分类、标签、评论、友链
│   │   ├── system/               # 用户、角色、菜单、部门、字典、配置、通知、日志、文件
│   │   ├── profile/              # 个人中心、我的通知
│   │   └── login/                # 登录、找回密码
│   ├── App.vue
│   └── main.ts
├── tests/                        # Vitest 单元测试
├── types/                        # 全局 TypeScript 类型声明
├── .env.development              # 开发环境变量
├── .env.production               # 生产环境变量
├── index.html                    # HTML 入口（引入 tianai-captcha 加载器）
├── vite.config.ts                # Vite 配置
├── vitest.config.ts              # Vitest 配置
├── eslint.config.ts              # ESLint 配置
└── package.json
```

## 环境要求

| 组件 | 要求 | 说明 |
| --- | --- | --- |
| Node.js | **>= 20**（推荐 20 LTS 或 22 LTS） | `package.json` 的 `engines` 为 `^18.0.0 \|\| >=20.0.0`；由于 `vitest@4` 要求 Node `^20.0.0 \|\| ^22.0.0 \|\| >=24.0.0`，实际开发请使用 Node 20 及以上 |
| 包管理器 | pnpm 10.x（推荐）或 npm 10.x | 仓库未提交锁文件；首次执行 `pnpm install` 会生成 `pnpm-lock.yaml`，建议提交到自己的仓库以固定依赖版本 |
| 后端服务 | `yun-blog-java` | 后台管理接口服务 `mengze-admin` 默认端口 `7616` |
| 后端运行环境 | JDK 17、Maven 3.8+、MySQL 8.x、Redis 6+ | 仅在后端部署时需要，详见 `yun-blog-java` 的 README |
| 浏览器 | Chrome / Edge / Firefox / Safari 最近两个大版本 | 不支持 IE |

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/hgt12/yun-blog-vue-admin.git
cd yun-blog-vue-admin
```

### 2. 安装依赖

```bash
# 推荐使用 pnpm
pnpm install

# 或使用 npm
# npm install
```

> 如果 pnpm 10 提示 `Ignored build scripts`（例如 `esbuild`），执行 `pnpm approve-builds` 并允许必要的构建脚本后重新安装即可。

### 3. 配置开发环境变量

仓库已提供 `.env.development`，按本地后端地址修改即可。示例配置如下（请以仓库自带文件为准，替换为你的实际后端地址和站点名称）：

```dotenv
# 开发环境
VITE_APP_PORT=3001
VITE_APP_TITLE=我的博客后台管理系统
VITE_APP_API_URL=http://localhost:7616
VITE_APP_WS_ENDPOINT=ws://localhost:7616/ws/admin
VITE_MOCK_DEV_SERVER=false

# 可选：通过 Vite 代理访问后端，避免跨域
# VITE_APP_BASE_API=/api
```

说明：

- **直连模式（仓库默认）**：不设置 `VITE_APP_BASE_API` 时，Axios 直接请求 `VITE_APP_API_URL`，需要后端允许前端来源的跨域请求。
- **代理模式（推荐用于规避跨域）**：设置 `VITE_APP_BASE_API=/api` 后，请求会带上 `/api` 前缀，由 `vite.config.ts` 中的开发服务器代理转发到 `VITE_APP_API_URL`，并自动去掉 `/api` 前缀。例如 `/api/auth/login` 会转发为 `http://localhost:7616/auth/login`。
- 后端不在本机时，请同步修改 `VITE_APP_API_URL` 和 `VITE_APP_WS_ENDPOINT`。

### 4. 启动开发服务器

确保后端 `mengze-admin` 已启动，然后执行：

```bash
pnpm dev
```

浏览器访问 <http://localhost:3001>（`vite.config.ts` 配置了 `open: true`，通常会自动打开）。

> 登录页预填的账号密码是前端占位示例，不能用于真实环境。请使用后端数据库初始化的管理员账号登录（默认种子账号见 `yun-blog-java/sql/yun_blog_seed.sql` 或后端 README），并在首次登录后立即修改默认密码。

## 环境变量说明

| 变量 | 作用 | 开发环境 | 生产环境 | 示例值 |
| --- | --- | --- | --- | --- |
| `VITE_APP_PORT` | 开发服务器端口（约定值） | `3001` | 不使用 | `3001` |
| `VITE_APP_TITLE` | 页面标题，构建时注入 `index.html` 的 `<title>` | 按项目自定义 | 按项目自定义 | `我的博客后台管理系统` |
| `VITE_APP_API_URL` | 后端接口根地址；同时作为 Vite `/api` 代理的目标地址 | `http://localhost:7616` | 通常不填，走同源 `/api` 反向代理 | `http://localhost:7616` |
| `VITE_APP_BASE_API` | Axios 的 `baseURL` / 接口前缀；不设置时回退到 `VITE_APP_API_URL` | 可留空，或设为 `/api` 走代理 | `/api` | `/api` |
| `VITE_APP_WS_ENDPOINT` | STOMP WebSocket 端点；留空则不启用字典同步和在线人数功能 | `ws://localhost:7616/ws/admin` | `wss://admin.example.com/ws/admin` | `ws://localhost:7616/ws/admin` |
| `VITE_MOCK_DEV_SERVER` | 是否启用 `vite-plugin-mock-dev-server` | `false` | 不使用 | `false` |

补充说明：

1. 当前 `vite.config.ts` 将开发服务器端口固定为 `3001`，修改 `VITE_APP_PORT` 本身不会改变端口；如需更换端口，请同时修改 `vite.config.ts` 中的 `server.port`。
2. `VITE_APP_TITLE` 用于首屏标题；应用启动后会调用后端站点配置接口，通常会用后端配置的站点名称覆盖 `document.title`。
3. `VITE_MOCK_DEV_SERVER=true` 时才会加载 mock 插件；当前仓库未内置 mock 数据文件，本地联调建议保持 `false`。
4. 所有环境变量以 `VITE_` 开头才会暴露给前端代码；修改 `.env.*` 后需要重启 Vite。
5. 请不要把任何真实密码、API Key、邮箱授权码等敏感信息提交到仓库。

生产环境 `.env.production` 示例：

```dotenv
VITE_APP_TITLE=我的博客后台管理系统
VITE_APP_BASE_API=/api
VITE_APP_WS_ENDPOINT=wss://admin.example.com/ws/admin
```

> 部署前请把 `VITE_APP_TITLE`、`VITE_APP_WS_ENDPOINT` 等值替换为你自己的站点名称和域名；如果页面使用 HTTPS，WebSocket 必须使用 `wss://`。

## 生产构建与 Nginx 部署

### 1. 构建

```bash
# 类型检查 + 生产构建，产物输出到 dist/
pnpm build

# 仅构建，跳过 vue-tsc 类型检查
pnpm build-only

# 本地预览构建产物（默认 http://localhost:4173）
pnpm preview
```

构建完成后，将 `dist/` 目录中的全部文件上传到服务器站点目录。`public/static/tac` 会被原样复制到 `dist/static/tac`，请勿删除。

### 2. Nginx 配置示例

以下配置假设：

- 前端静态文件部署在 `/var/www/yun-blog-vue-admin/dist`；
- 后端 `mengze-admin` 运行在本机 `127.0.0.1:7616`；
- 生产环境 `VITE_APP_BASE_API=/api`；
- 域名使用 `admin.example.com`（请替换为你的真实域名）。

```nginx
# /etc/nginx/conf.d/yun-blog-admin.conf
server {
    listen 80;
    server_name admin.example.com;

    root /var/www/yun-blog-vue-admin/dist;
    index index.html;
    client_max_body_size 10m;

    # 1) SPA 路由 fallback：刷新或直接访问子路径时返回 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2) 后台接口反向代理：
    #    /api/auth/login -> http://127.0.0.1:7616/auth/login
    #    proxy_pass 末尾的 "/" 会去掉 /api 前缀，需与后端路由保持一致
    location /api/ {
        proxy_pass http://127.0.0.1:7616/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 3) STOMP WebSocket 端点
    location /ws/admin {
        proxy_pass http://127.0.0.1:7616/ws/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }

    # 4) 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri =404;
    }
}
```

配置完成后检查并重载 Nginx：

```bash
nginx -t
nginx -s reload
```

### 3. HTTPS 与 WebSocket 注意事项

- 生产环境建议使用 HTTPS（例如通过 Certbot 申请证书），并将 HTTP 301 重定向到 HTTPS。
- 页面使用 HTTPS 时，`VITE_APP_WS_ENDPOINT` 必须使用 `wss://`；浏览器会拦截 HTTPS 页面中的 `ws://` 混合内容。
- HTTPS 的 server 块可参考（`http2 on;` 需要 Nginx 1.25.1+；旧版本可改为 `listen 443 ssl http2;`）：

```nginx
server {
    listen 80;
    server_name admin.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name admin.example.com;

    ssl_certificate     /etc/nginx/ssl/admin.example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/admin.example.com.key;

    # 此处粘贴上方 server 块中的 root、location /、location /api/、
    # location /ws/admin 与静态资源缓存配置
}
```

- 如果 Nginx 前还有 CDN、负载均衡或另一层反向代理，请确保传递 `X-Forwarded-Proto`，并按实际域名配置 `VITE_APP_WS_ENDPOINT`。
- 后端 `7616` 端口建议只监听本机或内网，由 Nginx 对外提供 `80/443` 访问。

## 后端对接说明

本项目是**后台管理前端**，必须配合 `yun-blog-java` 后端使用。建议先启动后端，再启动前端。

| 项目 | 说明 |
| --- | --- |
| 后端仓库 | <https://github.com/hgt12/yun-blog_java> |
| 后台管理接口服务 | `mengze-admin`，默认端口 `7616`，本项目管理端必需 |
| 前台博客接口服务 | `mengze-blog`，默认端口 `1314`，仅前台博客使用，后台管理不需要 |
| 数据库 | MySQL 8.x，默认库名 `yun_blog` |
| 缓存/状态 | Redis 6+，用于验证码、登录状态、统计和配置缓存等 |
| 构建运行环境 | JDK 17、Maven 3.8+ |
| 接口文档 | 启动后访问 <http://localhost:7616/swagger-ui.html> |

对接要点：

1. **接口地址**：开发环境将 `VITE_APP_API_URL` 指向 `http://localhost:7616`；生产环境设置 `VITE_APP_BASE_API=/api`，由 Nginx 将 `/api/*` 反向代理到后端 `mengze-admin`。
2. **数据库初始化**：后端仓库的 `sql/yun_blog_schema.sql` 提供表结构，`sql/yun_blog_seed.sql` 提供可选的最小初始化数据（管理员账号、角色、后台菜单等）。**登录账号由后端数据库初始化，本项目不保存账号密码；首次登录后请立即修改默认密码。**
3. **登录与验证码**：
   - 登录页的图形验证码由后端 `GET /auth/captcha` 返回 `captchaId` 和 `captchaBase64`，依赖后端 Redis 正常工作。
   - 滑块验证码使用 **tianai-captcha**，主要用于找回密码、绑定/更换手机号和邮箱等敏感操作。静态资源位于 `public/static/tac`，由 `public/static/load.min.js` 加载，`index.html` 中通过 `<script src="/static/load.min.js"></script>` 引入；`CaptchaModal.vue` 调用 `window.initTAC("/static/tac", ...)` 初始化，并访问后端 `/genCaptcha`、`/check` 接口（前端经 `/api` 前缀请求）。
   - 部署时务必保留 `dist/static/load.min.js` 和完整的 `dist/static/tac/` 目录，否则滑块验证码无法显示。
4. **跨域**：开发环境直连后端时，后端需要允许前端来源跨域；若不方便配置，可设置 `VITE_APP_BASE_API=/api` 使用 Vite 代理。生产环境统一走 Nginx 同源 `/api`，通常不会产生跨域问题。

## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Vite 开发服务器（默认 <http://localhost:3001>） |
| `pnpm build` | 类型检查（`vue-tsc --noEmit`）后执行生产构建，产物输出到 `dist/` |
| `pnpm build-only` | 仅执行 `vite build`，跳过类型检查 |
| `pnpm preview` | 本地预览生产构建产物（默认 <http://localhost:4173>） |
| `pnpm type-check` | 执行 `vue-tsc --noEmit` 类型检查 |
| `pnpm test` | 启动 Vitest（watch 模式） |
| `pnpm test:ui` | 启动 Vitest UI |
| `pnpm test:run` | 单次运行全部单元测试（当前仓库部分用例尚未与最新实现同步，暂不建议作为 CI 门禁） |
| `pnpm test:coverage` | 运行测试并生成覆盖率报告；如提示缺少 provider，先安装 `pnpm add -D @vitest/coverage-v8` |
| `pnpm lint` | 依次执行 ESLint、Prettier、Stylelint（会直接修复文件） |
| `pnpm lint:eslint` | 仅执行 ESLint（带 `--fix`） |
| `pnpm lint:prettier` | 仅执行 Prettier 格式化 |
| `pnpm lint:stylelint` | 仅执行 Stylelint（带 `--fix`） |
| `pnpm commit` | 使用 Commitizen 生成符合规范的提交信息 |

> 说明：`pnpm build` 与 `pnpm type-check` 已验证可通过；单元测试仍在完善中，部分历史用例可能与当前实现不一致，不影响项目启动、构建和部署。

## 常见问题排查

### 1. 刷新页面出现 404 或空白页

- 确认 Nginx 的 `root` 指向 `dist` 目录，且 `index.html` 存在。
- 配置 `try_files $uri $uri/ /index.html;` 作为 SPA fallback。
- 当前项目使用 **hash 路由**（`createWebHashHistory`），正常地址形如 `http://localhost:3001/#/dashboard`。如果改为 history 路由，必须配置上述 fallback。
- 如果部署在域名子路径（例如 `https://example.com/admin/`），需要同时配置 Vite 的 `base`、Nginx 的 `location`，并调整 `index.html` 中 `/static/load.min.js` 等绝对路径，否则 JS/CSS 会 404。当前项目默认按域名根路径部署。

### 2. 接口 404 或跨域

- 先确认后端已启动：访问 <http://localhost:7616/swagger-ui.html>，并检查 `VITE_APP_API_URL` 的协议、主机和端口。
- 开发环境直连模式出现 CORS 错误时，可设置 `VITE_APP_BASE_API=/api` 改用 Vite 代理；或让后端允许前端开发地址跨域。
- 生产环境检查 `VITE_APP_BASE_API=/api` 和 Nginx `location /api/`。`proxy_pass http://127.0.0.1:7616/;` 末尾有 `/` 时会去掉 `/api` 前缀；如果后端接口本身带 `/api` 前缀，应改为 `proxy_pass http://127.0.0.1:7616;`。
- 修改 `.env.*` 后重启 `pnpm dev` 或重新执行 `pnpm build`。

### 3. WebSocket 连接失败

- 确认 `.env.*` 中 `VITE_APP_WS_ENDPOINT` 不为空；留空会关闭字典同步和在线人数功能。
- 本地 HTTP 页面使用 `ws://localhost:7616/ws/admin`；HTTPS 页面必须使用 `wss://`。
- 检查 Nginx 的 `/ws/admin` 是否配置了 `Upgrade` 和 `Connection "upgrade"` 请求头，以及足够长的 `proxy_read_timeout`。
- 打开浏览器开发者工具的 Network → WS 面板，确认连接 URL、HTTP 状态码和鉴权 Token 是否正常。
- 未登录或 Token 失效时，后台在线人数 WebSocket 不会建立连接，这是正常现象。

### 4. 验证码不显示

- **登录页图形验证码**：检查后端 `GET /auth/captcha` 是否正常返回；该接口依赖 Redis，请确认 Redis 已启动。
- **tianai-captcha 滑块验证码**：检查 `dist/static/load.min.js`、`dist/static/tac/js/tac.min.js`、`dist/static/tac/css/tac.css` 是否可访问（浏览器直接打开应返回 200）。
- 检查 Nginx 是否正确托管了 `dist/static` 目录，以及 `/api/genCaptcha`、`/api/check` 是否能转发到后端。
- 查看浏览器控制台是否有 `TAC未加载`、`验证码组件加载失败` 等错误。

### 5. Node 版本过低

- 执行 `node -v` 确认版本，建议使用 Node 20 LTS 或 22 LTS。
- `vitest@4` 要求 Node 20 及以上；使用 Node 18 可能导致测试或构建失败。
- 切换 Node 版本后建议删除 `node_modules` 并重新执行 `pnpm install`。

### 6. 端口 3001 被占用

```powershell
# Windows PowerShell 查看占用进程
netstat -ano | findstr :3001

# Linux / macOS
lsof -i :3001
```

可关闭占用进程，或修改 `vite.config.ts` 中的 `server.port`（同时同步 `.env.development` 的 `VITE_APP_PORT` 以保持一致）。

### 7. 登录失败或提示账号密码错误

- 本项目不内置真实账号，登录账号来自后端数据库初始化；请查看 `yun-blog-java/sql/yun_blog_seed.sql` 或数据库中 `sys_user` 表。
- 登录页预填的账号密码只是前端占位示例，请清空后输入后端真实账号。
- 首次使用默认管理员登录后，请立即在个人中心修改密码。

## 许可证与致谢

本项目采用 [MIT License](LICENSE)。

- 感谢 [有来开源组织](https://gitee.com/youlaiorg) 的 [vue3-element-admin](https://gitee.com/youlaiorg/vue3-element-admin)，本项目的工程结构、布局与部分通用组件基于该项目二次开发。
- 感谢 [Tianai Captcha（天爱验证码）](https://github.com/dromara/tianai-captcha) 提供滑块验证码组件；其采用 Apache-2.0 许可证，许可证副本见 `public/static/tac/LICENSE`。
- 感谢 Vue、Vite、Element Plus、Pinia、Vue Router、ECharts、WangEditor、md-editor-v3、vxe-table 等开源项目。

## 参与贡献

1. Fork 本仓库并创建功能分支：`git checkout -b feat/your-feature`。
2. 安装依赖并完成开发：`pnpm install && pnpm dev`。
3. 提交前至少运行 `pnpm lint`、`pnpm type-check` 和 `pnpm build`；如修改了测试用例，请同时运行 `pnpm test:run`。
4. 提交信息请遵循 Conventional Commits（例如 `feat: 新增文章导出`、`fix: 修复登录验证码刷新`）。
5. 提交 Pull Request，并说明变更内容与测试情况。

## 问题反馈

欢迎通过 <https://github.com/hgt12/yun-blog-vue-admin/issues> 提交 Issue 反馈问题或建议。
