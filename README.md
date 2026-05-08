# HeatEx Direct

Last updated: 2026-05-08.

## English

HeatEx Direct is a bilingual static B2B sourcing site for industrial heat exchangers. It helps international buyers review Chinese heat exchanger manufacturers, compare product pages, and submit structured RFQs. Supabase is the operational source of truth, while the public catalogue is generated into local JSON and pre-rendered at build time.

### Current Snapshot

| Item | Current state |
| --- | --- |
| Site name | HeatEx Direct |
| Domain | `https://heatexdirect.com/` |
| Runtime languages | `en`, `zh` |
| Public catalogue | Static pages generated from `src/locales/{en,zh}` |
| Backend | Supabase DB, Supabase Storage bucket `assets`, Supabase Auth |
| Current data volume | 5 manufacturers, 30 products, 9 industries, 250 countries, 6 Velite posts |
| RFQ behavior | Email OTP verification, then insert into `rfqs`; automatic supplier routing is not implemented yet |

### Tech Stack

| Layer | Tool / package | Version |
| --- | --- | --- |
| UI runtime | React / React DOM | `^18.3.1` |
| Language | TypeScript | `~5.9.3` |
| Build | Vite | `^7.1.7` |
| SSG | vite-react-ssg | `^0.8.9` |
| Routing | React Router DOM | `^6.30.1` |
| Styling | Tailwind CSS + `@tailwindcss/postcss` | `^4.1.16` |
| UI primitives | Radix UI / shadcn-style components | see `src/components/ui` |
| Icons | lucide-react | `^0.547.0` |
| i18n | i18next / react-i18next | `^25.6.0` / `^16.2.3` |
| Backend client | `@supabase/supabase-js` | `^2.76.1` |
| Markdown content | Velite | `^0.3.0` |
| Lint | ESLint / typescript-eslint | `^9.36.0` / `^8.45.0` |
| Package manager | pnpm | lockfile: `pnpm-lock.yaml` |

### Commands

Use pnpm.

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install dependencies. |
| `pnpm dev` | Run Velite dev and vite-react-ssg dev together. |
| `pnpm build` | Build Velite content and pre-render the static site into `dist/`. |
| `pnpm build:spa` | Type-check, build Velite, then run a normal Vite SPA build. |
| `pnpm preview` | Preview the built site locally. |
| `pnpm lint` | Run ESLint. |
| `pnpm sync` | Pull Supabase DB/Storage data and regenerate locale JSON. |

### Environment Variables

Do not commit real `.env` files.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_TITLE` | Site title for metadata. |
| `VITE_SITE_URL` | Canonical base URL, currently `https://heatexdirect.com/`. |
| `VITE_CONTACT_EMAIL` | Public contact email. |
| `VITE_GA_MEASUREMENT_ID` | Optional GA4 measurement ID. Analytics loads only after cookie consent is accepted. |
| `VITE_SUPABASE_URL` | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Browser anon key for auth and RFQ insert according to RLS. |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Local sync key for `src/scripts/*`; never expose in browser code. |
| `VITE_ENABLE_AUTH` | Must be exactly `true` to enable login, register, and dashboard routes. |
| `VITE_ENABLE_BLOG` | Must be exactly `true` to include blog routes. |
| `VITE_ENABLE_LANGUAGE_TOGGLE` | Must be exactly `true` to show the language toggle. |
| `VITE_ENABLE_THEME_TOGGLE` | Must be exactly `true` to show the theme toggle. |
| `VITE_DEFAULT_LANGUAGE` | Pre-hydration fallback language. |
| `VITE_SUPPORTED_LANGUAGES` | Comma-separated pre-hydration language list. |

The importer uses `supabase_importer/.env` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Project Map

```text
content/{news,posts}/          Velite Markdown industry articles by company/language
doc/                           Project docs and Obsidian business docs
public/                        Static files copied to the build output
public/storage/assets/          Supabase Storage files synced locally
src/components/                 Shared navigation, footer, toggles, UI primitives
src/context/                    Auth and language providers
src/data/                       Raw JSON exported from Supabase
src/lib/supabase/               Browser client, OTP helpers, RFQ insert helper
src/locales/                    UI translations and generated catalogue JSON
src/pages/                      Route-level React pages
src/routes/config/              Route definitions and feature flags
src/scripts/                    Supabase sync and locale generation scripts
supabase_importer/              Local JSON/assets import workflow for Supabase
```

The detailed technical map is in `doc/project-structure.md`.

### Routes and SSG

The route source is `src/routes/config/index.ts`. English uses root paths; Chinese routes use the `/zh` prefix.

Public routes include `/`, `/manufacturers`, `/manufacturers/:slug`, `/products`, `/products/:manufacturerSlug/:productSlug`, `/rfq`, `/update-your-profile`, `/content-marketing-services`, `/about`, `/contact`, `/terms`, and `/privacy`. The legacy `/claim-your-profile` route redirects to `/update-your-profile`.

`/industry-news` and `/industry-news/:contentType/:slug` are included only when `VITE_ENABLE_BLOG=true`. `/login`, `/register`, and `/dashboard` are active only when `VITE_ENABLE_AUTH=true`.

Industry News Markdown lives under `content/{news,posts}/{company}/{lang}/{article}.md`, for example `content/posts/heatex-direct/en/buying-guide.md`. Public article URLs omit the company folder and use `/industry-news/{news|posts}/{article}`. Blog routes are generated from `.velite/posts.json` when the blog flag is enabled.

### Data and Supabase

Normal update path:

```text
Supabase DB + Storage
  -> pnpm sync
  -> src/data/*.json
  -> public/storage/assets/**
  -> src/locales/{en,zh}/**/*.json
  -> pnpm build
  -> dist/
```

`pnpm sync` exports `countries`, `industries`, `manufacturers`, `manufacturer_assets`, `products`, and `product_assets`. It intentionally does not export `rfqs`.

`rfqs` is live-only. The frontend inserts verified buyer requests through `src/lib/supabase/db.ts`. Current code does not automatically match RFQs to manufacturers, send supplier emails, attach files, or populate `manufacturers_sent_list`.

### Importer

`supabase_importer/import.js` is the reverse workflow: it imports local manufacturer JSON and local assets into Supabase. It can upsert records, upload files, and clean missing records/assets for whitelisted manufacturers in `supabase_importer/data/sync_config.json`. Review the target project, service role key, whitelist, and payload before using it on production data.

### Deployment

1. Confirm production env values, especially `VITE_SITE_URL=https://heatexdirect.com/`.
2. Run `pnpm sync` if catalogue data changed.
3. Run `pnpm lint`.
4. Run `pnpm build`.
5. Deploy `dist/` to the static host. Keep `.htaccess` behavior if the host uses Apache.
6. Update `robots.txt` and `sitemap.xml` when domain or public routes change.

### Documentation Set

The documentation is intentionally compact:

| File | Purpose |
| --- | --- |
| `README.md` | Setup, scripts, environment, data flow, deployment. |
| `doc/project_overview.md` | Product meaning, users, strategy, priorities. |
| `doc/project-structure.md` | Repository structure, routes, Supabase data layer, scripts. |
| `doc/obsdian/*.md` | Bilingual business and operating notes. |

## 中文

HeatEx Direct 是一个中英文双语的静态 B2B 换热器采购网站。它帮助海外买家查看中国换热器制造商、比较产品页面，并提交结构化 RFQ。Supabase 是运营数据源；公开目录数据会同步为本地 JSON，并在构建时预渲染为静态页面。

### 当前状态

| 项目 | 当前状态 |
| --- | --- |
| 网站名称 | HeatEx Direct |
| 域名 | `https://heatexdirect.com/` |
| 运行语言 | `en`, `zh` |
| 公开目录 | 从 `src/locales/{en,zh}` 生成静态页面 |
| 后端 | Supabase DB、Supabase Storage `assets` bucket、Supabase Auth |
| 当前数据量 | 5 个厂家、30 个产品、9 个行业、250 个国家、6 篇 Velite 文章 |
| RFQ 行为 | 邮箱 OTP 验证后写入 `rfqs`；尚未实现自动供应商匹配或自动发送 |

### 技术栈

| 层级 | 工具 / 包 | 版本 |
| --- | --- | --- |
| UI 运行时 | React / React DOM | `^18.3.1` |
| 语言 | TypeScript | `~5.9.3` |
| 构建 | Vite | `^7.1.7` |
| 静态生成 | vite-react-ssg | `^0.8.9` |
| 路由 | React Router DOM | `^6.30.1` |
| 样式 | Tailwind CSS + `@tailwindcss/postcss` | `^4.1.16` |
| UI 组件 | Radix UI / shadcn 风格组件 | 见 `src/components/ui` |
| 图标 | lucide-react | `^0.547.0` |
| 国际化 | i18next / react-i18next | `^25.6.0` / `^16.2.3` |
| 后端客户端 | `@supabase/supabase-js` | `^2.76.1` |
| Markdown 内容 | Velite | `^0.3.0` |
| 代码检查 | ESLint / typescript-eslint | `^9.36.0` / `^8.45.0` |
| 包管理 | pnpm | 锁文件：`pnpm-lock.yaml` |

### 常用命令

使用 pnpm。

| 命令 | 用途 |
| --- | --- |
| `pnpm install` | 安装依赖。 |
| `pnpm dev` | 同时运行 Velite dev 和 vite-react-ssg dev。 |
| `pnpm build` | 构建 Velite 内容并预渲染静态站到 `dist/`。 |
| `pnpm build:spa` | TypeScript 检查、Velite 构建、普通 Vite SPA 构建。 |
| `pnpm preview` | 本地预览构建结果。 |
| `pnpm lint` | 运行 ESLint。 |
| `pnpm sync` | 从 Supabase 拉取 DB/Storage 数据并重新生成 locale JSON。 |

### 环境变量

不要提交真实 `.env` 文件。

| 变量 | 用途 |
| --- | --- |
| `VITE_SITE_TITLE` | 元数据中的网站标题。 |
| `VITE_SITE_URL` | canonical 基础地址，当前为 `https://heatexdirect.com/`。 |
| `VITE_CONTACT_EMAIL` | 公开联系邮箱。 |
| `VITE_GA_MEASUREMENT_ID` | 可选 GA4 Measurement ID。只有在用户同意 Cookie 分析后才加载 Analytics。 |
| `VITE_SUPABASE_URL` | Supabase 项目 URL。 |
| `VITE_SUPABASE_ANON_KEY` | 浏览器端 anon key，用于 Auth 和 RFQ 插入，权限取决于 RLS。 |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | 本地同步脚本使用的 service role key，绝不能进浏览器代码。 |
| `VITE_ENABLE_AUTH` | 必须精确等于 `true` 才启用登录、注册、dashboard 路由。 |
| `VITE_ENABLE_BLOG` | 必须精确等于 `true` 才启用博客路由。 |
| `VITE_ENABLE_LANGUAGE_TOGGLE` | 必须精确等于 `true` 才显示语言切换。 |
| `VITE_ENABLE_THEME_TOGGLE` | 必须精确等于 `true` 才显示主题切换。 |
| `VITE_DEFAULT_LANGUAGE` | React hydration 前的默认语言。 |
| `VITE_SUPPORTED_LANGUAGES` | hydration 前使用的逗号分隔语言列表。 |

导入器单独使用 `supabase_importer/.env`，包含 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`。

### 项目结构

```text
content/{news,posts}/          按公司和语言分组的 Velite 行业文章
doc/                           项目文档和 Obsidian 业务文档
public/                        原样复制到构建产物的静态文件
public/storage/assets/          本地同步的 Supabase Storage 文件
src/components/                 导航、页脚、切换器、UI 基础组件
src/context/                    Auth 和语言 Provider
src/data/                       从 Supabase 导出的原始 JSON
src/lib/supabase/               浏览器客户端、OTP helper、RFQ 插入 helper
src/locales/                    UI 翻译和生成的目录 JSON
src/pages/                      路由级 React 页面
src/routes/config/              路由定义和功能开关
src/scripts/                    Supabase 同步和 locale 生成脚本
supabase_importer/              本地 JSON/资产导入 Supabase 的工作流
```

更完整的技术结构见 `doc/project-structure.md`。

### 路由与 SSG

路由源是 `src/routes/config/index.ts`。英文使用根路径，中文使用 `/zh` 前缀。

公开路由包括 `/`、`/manufacturers`、`/manufacturers/:slug`、`/products`、`/products/:manufacturerSlug/:productSlug`、`/rfq`、`/update-your-profile`、`/content-marketing-services`、`/about`、`/contact`、`/terms`、`/privacy`。旧的 `/claim-your-profile` 会重定向到 `/update-your-profile`。

`/industry-news` 和 `/industry-news/:contentType/:slug` 只有在 `VITE_ENABLE_BLOG=true` 时启用。`/login`、`/register`、`/dashboard` 只有在 `VITE_ENABLE_AUTH=true` 时启用。

Industry News Markdown 放在 `content/{news,posts}/{company}/{lang}/{article}.md`，例如 `content/posts/heatex-direct/zh/buying-guide.md`。公开文章 URL 不显示公司文件夹，使用 `/industry-news/{news|posts}/{article}`。博客路由在博客开关启用时从 `.velite/posts.json` 生成。

### 数据与 Supabase

正常更新路径：

```text
Supabase DB + Storage
  -> pnpm sync
  -> src/data/*.json
  -> public/storage/assets/**
  -> src/locales/{en,zh}/**/*.json
  -> pnpm build
  -> dist/
```

`pnpm sync` 导出 `countries`、`industries`、`manufacturers`、`manufacturer_assets`、`products`、`product_assets`，不会导出 `rfqs`。

`rfqs` 是实时数据表。前端通过 `src/lib/supabase/db.ts` 写入已验证邮箱的采购需求。当前代码尚未实现自动匹配厂家、自动发送供应商邮件、附件上传或写入 `manufacturers_sent_list`。

### 导入器

`supabase_importer/import.js` 是反向流程：把本地厂家 JSON 和本地资产导入 Supabase。它可以 upsert 记录、上传文件，并按 `supabase_importer/data/sync_config.json` 中的厂家白名单清理缺失记录/资产。用于生产数据前必须检查目标项目、service role key、白名单和 payload。

### 部署

1. 确认生产环境变量，特别是 `VITE_SITE_URL=https://heatexdirect.com/`。
2. 如果目录数据变化，运行 `pnpm sync`。
3. 运行 `pnpm lint`。
4. 运行 `pnpm build`。
5. 将 `dist/` 部署到静态主机；如果主机使用 Apache，保留 `.htaccess` 行为。
6. 域名或公开路由变化时更新 `robots.txt` 和 `sitemap.xml`。

### 文档集合

文档保持精简：

| 文件 | 用途 |
| --- | --- |
| `README.md` | 安装、脚本、环境变量、数据流、部署。 |
| `doc/project_overview.md` | 项目意义、用户、战略、优先级。 |
| `doc/project-structure.md` | 仓库结构、路由、Supabase 数据层、脚本。 |
| `doc/obsdian/*.md` | 中英文业务和运营说明。 |