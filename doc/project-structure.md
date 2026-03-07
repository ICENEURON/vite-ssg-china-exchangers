# 项目结构文档 — vite-ssg-china-exchangers

> 生成日期：2026-03-08

## 技术栈概览

| 类别       | 技术                                         |
| ---------- | -------------------------------------------- |
| 框架       | React 18 + TypeScript                        |
| 构建工具   | Vite 7                                       |
| SSG        | vite-react-ssg                               |
| 内容管理   | Velite（Markdown → JSON）                    |
| 样式       | TailwindCSS 4 + tailwindcss-animate          |
| UI 组件库  | Shadcn UI（Radix UI 基础）                   |
| 国际化     | i18next + react-i18next（en / zh / ja）       |
| 后端/认证  | Supabase                                     |
| 代码质量   | ESLint + TypeScript                          |
| 包管理     | pnpm                                         |

---

## 项目根目录

```
vite-ssg-china-exchangers/
├── .env                      # 环境变量（语言配置、功能开关等）
├── .gitignore
├── .htaccess                 # Apache 服务器重写规则
├── .velite/                  # Velite 构建输出（自动生成的 JSON 数据）
├── LICENSE
├── README.md
│
├── content/                  # 📝 Markdown 内容源文件
├── dist/                     # 📦 构建产物
├── doc/                      # 📄 项目文档
├── node_modules/
├── public/                   # 🌐 静态资源
├── src/                      # 🧩 源代码
│
├── eslint.config.js          # ESLint 配置
├── index.html                # 入口 HTML 模板
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml       # pnpm workspace 配置
├── postcss.config.js         # PostCSS 配置（TailwindCSS）
├── robots.txt                # 搜索引擎爬虫规则
├── sitemap.xml               # 站点地图
├── tailwind.config.js        # TailwindCSS 配置
├── tsconfig.json             # TypeScript 根配置
├── tsconfig.app.json         # 应用端 TS 配置
├── tsconfig.node.json        # Node 端 TS 配置
├── velite.config.ts          # Velite 内容管理配置
└── vite.config.ts            # Vite 构建配置（含 SSG 路由配置）
```

---

## `src/` — 源代码目录

```
src/
├── main.tsx                  # 应用入口文件
├── index.css                 # 全局样式（TailwindCSS 指令 + 自定义样式）
│
├── app/                      # 应用级页面（需认证）
├── assets/                   # 静态资源（字体、图标、插图、logo）
├── components/               # 可复用组件
├── config/                   # 应用配置
├── context/                  # React Context（认证、语言）
├── i18n/                     # i18next 初始化配置
├── layouts/                  # 页面布局
├── lib/                      # 第三方库封装
├── locales/                  # 国际化翻译文件
├── pages/                    # 公开页面
├── routes/                   # 路由配置
├── types/                    # TypeScript 类型定义
└── utils/                    # 工具函数 & 自定义 Hooks
```

### `src/app/` — 应用页面（受保护路由）

```
app/
└── dashboard/
    └── index.tsx             # 用户仪表盘页面
```

### `src/assets/` — 静态资源

```
assets/
├── fonts/                    # 自定义字体（当前为空）
├── icons/                    # 图标文件（当前为空）
├── illustrations/            # SVG 插图（当前为空）
└── logos/
    ├── logo.png              # 深色主题 Logo
    └── logo_light.png        # 浅色主题 Logo
```

### `src/components/` — 可复用组件

```
components/
├── footer/
│   └── index.tsx             # 页脚组件
├── language-toggle/
│   └── index.tsx             # 语言切换按钮
├── navigation/
│   ├── index.tsx             # 导航栏（桌面端 + 移动端）
│   └── nav-popup.tsx         # 移动端弹出导航菜单
├── theme-toggle/
│   └── index.tsx             # 主题（亮/暗）切换按钮
└── ui/                       # Shadcn UI 基础组件
    ├── accordion.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── carousel.tsx
    ├── footer.tsx
    ├── input.tsx
    ├── navigation-menu.tsx
    ├── pagination.tsx
    ├── table.tsx
    └── tabs.tsx
```

### `src/config/` — 应用配置

```
config/
└── languages.ts              # 支持的语言列表与配置
```

### `src/context/` — React Context

```
context/
├── auth/
│   └── index.tsx             # 认证上下文（Supabase）
└── language/
    └── index.tsx             # 语言上下文
```

### `src/i18n/` — 国际化

```
i18n/
├── config.ts                 # i18next 初始化配置
├── index.ts                  # 导出入口
└── types.ts                  # i18n 类型定义
```

### `src/layouts/` — 页面布局

```
layouts/
└── page/
    └── index.tsx             # 通用页面布局（含导航栏 + 页脚）
```

### `src/lib/` — 第三方库封装

```
lib/
└── supabase/
    └── client.ts             # Supabase 客户端实例
```

### `src/locales/` — 国际化翻译文件

```
locales/
├── index.ts                  # 翻译资源聚合导出
├── languages.json            # 语言元数据
├── languages.ts              # 语言配置
├── resources.ts              # i18next 资源注册
│
├── en/                       # 🇺🇸 英语
│   ├── index.ts
│   ├── footer.json           # 页脚翻译
│   ├── navigation.json       # 导航栏翻译
│   └── pages/
│       ├── 404.json
│       ├── about.json
│       ├── claim-your-profile.json
│       ├── content-marketing-services.json
│       ├── dashboard.json
│       ├── home.json
│       ├── industry-news.json
│       ├── login.json
│       ├── manufacturers.json
│       ├── privacy.json
│       ├── products.json
│       ├── register.json
│       ├── rfq.json
│       ├── terms.json
│       └── manufacturers/
│           ├── list.json
│           └── shanghai-heat-transfer-equipment-co-ltd.json
│
├── zh/                       # 🇨🇳 简体中文
│   ├── index.ts
│   ├── footer.json
│   ├── navigation.json
│   └── pages/
│       └── ...（与英语结构对应）
│
└── ja/                       # 🇯🇵 日语
    ├── index.ts
    ├── footer.json
    ├── navigation.json
    └── pages/
        └── ...（与英语结构对应）
```

### `src/pages/` — 公开页面

```
pages/
├── 404/
│   └── index.tsx                             # 404 页面
│
├── home/
│   ├── index.tsx                             # 首页
│   └── components/
│       ├── CategoryShowcase.tsx              # 产品分类展示
│       ├── HeroSection.tsx                   # 首页 Hero 区域
│       ├── HowItWorks.tsx                    # 工作流程说明
│       └── ValuePropGrid.tsx                 # 价值主张网格
│
├── about/
│   ├── index.tsx                             # 关于我们页面
│   └── components/
│       ├── AboutCTA.tsx                      # CTA 按钮
│       ├── AboutHero.tsx                     # Hero 区域
│       ├── ProblemSection.tsx                # 问题描述区
│       ├── VerificationGrid.tsx             # 验证网格
│       └── WhoWeAre.tsx                     # 团队介绍
│
├── industry-news/
│   ├── index.tsx                             # 行业新闻列表页
│   ├── post.tsx                              # 单篇新闻详情页
│   └── components/
│       ├── NewsCard.tsx                      # 新闻卡片
│       ├── NewsHero.tsx                      # 新闻 Hero 区域
│       └── NewsList.tsx                      # 新闻列表
│
├── manufacturers/
│   ├── index.tsx                             # 制造商列表页
│   ├── shanghai-heat-transfer-equipment-co-ltd/
│   │   └── index.tsx                         # 特定制造商详情页
│   └── components/
│       ├── HeroSection.tsx
│       └── ManufacturerCard.tsx
│
├── claim-your-profile/
│   ├── index.tsx                             # 认领企业资料页
│   └── components/
│       ├── BenefitsSection.tsx
│       ├── HeroSection.tsx
│       ├── StepByStepSection.tsx
│       └── VerificationSection.tsx
│
├── content-marketing-services/
│   ├── index.tsx                             # 内容营销服务页
│   └── components/
│       ├── CTASection.tsx
│       ├── GuidelinesSection.tsx
│       ├── HeroSection.tsx
│       ├── PlatformValueSection.tsx
│       └── ProcessSection.tsx
│
├── rfq/
│   ├── index.tsx                             # 询价请求页
│   └── components/
│       ├── LivePreview.tsx
│       ├── ProductSelector.tsx
│       ├── ProgressTracker.tsx
│       └── TechSpecsForm.tsx
│
├── login/
│   └── index.tsx                             # 登录页
├── register/
│   └── index.tsx                             # 注册页
├── privacy/
│   └── index.tsx                             # 隐私政策页
└── terms/
    └── index.tsx                             # 服务条款页
```

### `src/routes/` — 路由配置

```
routes/
├── config/
│   └── index.ts              # 路由定义与配置
└── protected-route/
    └── index.tsx             # 受保护路由 HOC（需登录才可访问）
```

### `src/types/` — TypeScript 类型

```
types/
└── global.d.ts               # 全局类型声明（Velite 模块等）
```

### `src/utils/` — 工具函数 & 自定义 Hooks

```
utils/
├── cn/
│   └── index.ts              # className 合并工具（clsx + tailwind-merge）
├── initial-state.ts          # SSG 初始状态
├── language-routing/
│   └── index.ts              # 语言路由处理
├── use-language/
│   └── index.tsx             # 语言切换 Hook
└── use-theme/
    └── index.tsx             # 主题切换 Hook
```

---

## `content/` — 内容文件

```
content/
└── posts/                    # Markdown 文章（通过 Velite 处理）
    ├── en/                   # 英文文章
    │   ├── advanced-typescript-patterns.md
    │   ├── getting-started-with-velite.md
    │   └── mastering-react-hooks.md
    ├── zh/                   # 中文文章
    │   └── getting-started-with-velite.md
    └── ja/                   # 日文文章
        └── getting-started-with-velite.md
```

> Velite 在构建时将 Markdown 编译为 JSON 输出到 `.velite/` 目录，并将静态资源（如文章封面图片）输出到 `public/static/`。

---

## `public/` — 静态资源

```
public/
├── 404.html                  # 静态 404 页面（同构降级用）
├── favicon.ico               # 网站图标
├── init.js                   # 初始化脚本（主题 & 语言检测，SSG 前执行）
└── static/
    ├── content_posts_image/  # 文章封面图片
    │   ├── advanced-typescript-patterns/
    │   ├── default/
    │   ├── getting-started-with-velite/
    │   └── mastering-react-hooks/
    ├── manufacturers/        # 制造商相关图片
    │   └── shanghai-heat-transfer-equipment-co-ltd/
    └── websites/             # 网站全局图片
        ├── home-hero.png
        ├── home-category.png
        ├── manufacturers-hero.png
        ├── logo.png
        ├── logo_light.png
        ├── logo_icon.png
        └── logo_icon_light.png
```

---

## 核心配置文件说明

### `vite.config.ts`

- 使用 `@vitejs/plugin-react` 插件
- 路径别名：`@` → `./src`，`.velite` → `./.velite`
- 自定义 `htmlEnvReplace` 插件在构建时将环境变量注入 HTML
- SSG 选项中通过 `includedRoutes` 动态加入 Velite 生成的博客路由

### `velite.config.ts`

- 内容根目录：`content/`
- 定义 `Post` 集合，schema 包含 `title`、`date`、`excerpt`、`content` 等字段
- 自动从文件路径提取 `lang`（语言）和 `slug`
- 生成多语言 `permalink`（如 `/industry-news/slug` 或 `/zh/industry-news/slug`）
- 使用 `rehype-pretty-code` 进行代码高亮（支持亮/暗主题）

### `.env` 环境变量

项目通过环境变量控制功能开关：

| 变量名                         | 说明                   |
| ------------------------------ | ---------------------- |
| `VITE_DEFAULT_LANGUAGE`        | 默认语言               |
| `VITE_SUPPORTED_LANGUAGES`     | 支持的语言列表         |
| `VITE_ENABLE_LANGUAGE_TOGGLE`  | 是否启用语言切换       |
| `VITE_ENABLE_THEME_TOGGLE`     | 是否启用主题切换       |
| `VITE_ENABLE_BLOG`             | 是否启用博客功能       |
| `VITE_SUPABASE_URL`            | Supabase 项目 URL      |
| `VITE_SUPABASE_ANON_KEY`       | Supabase 匿名密钥     |

---

## NPM Scripts

| 命令            | 说明                                     |
| --------------- | ---------------------------------------- |
| `npm run dev`   | 同时启动 Velite 热更新 + Vite 开发服务器 |
| `npm run build` | 先构建 Velite，再执行 SSG 构建          |
| `npm run build:spa` | TypeScript 检查 + Velite 构建 + SPA 构建 |
| `npm run lint`  | 运行 ESLint 代码检查                    |
| `npm run preview` | 预览构建结果                           |

---

## 架构特点

1. **静态站点生成（SSG）**：通过 `vite-react-ssg` 在构建时预渲染所有页面，提升 SEO 与首屏加载速度
2. **内容驱动**：使用 Velite 管理 Markdown 内容，支持多语言文章
3. **三语国际化**：支持英语（en）、中文（zh）、日语（ja），翻译文件按页面组织
4. **认证系统**：通过 Supabase 提供用户注册/登录和受保护路由
5. **主题切换**：支持亮色/暗色主题，通过 `init.js` 预加载避免闪烁
6. **组件化页面**：每个页面拆分为独立子组件（Hero、CTA、Grid 等），保持代码清晰
7. **Shadcn UI**：基于 Radix UI 的无头组件库，提供高度可定制的 UI 组件
