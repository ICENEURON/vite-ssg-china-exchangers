# Project Structure / 项目结构

Last updated: 2026-05-08.

## English

This document maps the current repository and includes the Supabase data-layer notes that were previously split into a separate file.

### Top-Level Structure

```text
content/              Velite Markdown industry article sources
doc/                  Project docs and Obsidian business docs
public/               Static files copied into deployment output
src/                  React application source
supabase_importer/    Local JSON/assets import workflow for Supabase
```

There is no checked-in `supabase/` migrations directory.

### Documentation Set

The active documentation set is intentionally small:

| File | Role |
| --- | --- |
| `doc/project_overview.md` | Canonical project, product, user, and growth overview. |
| `doc/project-structure.md` | Canonical repository, route, data-layer, and script reference. |
| `doc/seo-geo-keyword-strategy.md` | SEO, GEO, keyword, and Industry News content strategy. |
| `doc/obsdian/1. Project Overview (项目介绍).md` | Short bilingual executive overview for business notes. |
| `doc/obsdian/2. Supplier Partnership Proposal（供应商合作方案）.md` | Supplier-facing partnership and data requirements. |
| `doc/obsdian/3. Buyer Guide（买家指南）.md` | Buyer-facing usage and RFQ expectations. |
| `doc/obsdian/5. RFQ Specification（询价数据结构）.md` | Detailed RFQ behavior and payload reference. |

The previous supplier database note was removed because its maintained content is folded into this file.

### Root Files

| File | Purpose |
| --- | --- |
| `package.json` | Scripts and dependency versions. |
| `pnpm-lock.yaml` | Canonical dependency lockfile. |
| `vite.config.ts` | Vite, React plugin, aliases, HTML env replacement, SSG route generation. |
| `velite.config.ts` | Markdown post schema and Velite output. |
| `eslint.config.js` | ESLint flat config. |
| `tsconfig*.json` | TypeScript project configuration. |
| `postcss.config.js` | Wires Tailwind CSS v4 and Autoprefixer into PostCSS. Tailwind theme, plugins, and dark variant live in `src/index.css`. |
| `index.html` | Vite HTML entry and pre-hydration env bootstrap. |
| `.htaccess` | Apache static hosting rewrite, cache, compression, and headers. |
| `robots.txt` / `sitemap.xml` | Search engine crawling and static sitemap for `heatexdirect.com`. |

### `src/` Map

```text
src/main.tsx                 SSG app root and providers
src/index.css                Tailwind import, theme tokens, global styles
src/app/                     Auth-protected dashboard area
src/assets/                  Bundled app assets
src/components/              Shared UI, navigation, footer, toggles
src/config/                  Runtime configuration helpers
src/context/                 Auth and language contexts
src/data/                    Raw JSON exported from Supabase
src/i18n/                    i18next setup
src/layouts/                 Page shell components
src/lib/supabase/            Supabase browser client, auth, RFQ insert
src/locales/                 UI translations and generated catalogue JSON
src/pages/                   Route-level pages
src/routes/                  Route config and protected route wrapper
src/scripts/                 Data sync and locale generation scripts
src/types/                   Global declarations
src/utils/                   Routing, theme, language, class helpers
```

### Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page. |
| `/manufacturers` | Manufacturer list. |
| `/manufacturers/:slug` | Manufacturer profile, generated from manufacturer list JSON. |
| `/products` | Product list. |
| `/products/:manufacturerSlug/:productSlug` | Product profile, generated from product list JSON. |
| `/rfq` | Smart RFQ builder. |
| `/update-your-profile` | Manufacturer profile update page. |
| `/claim-your-profile` | Legacy redirect to `/update-your-profile`. |
| `/content-marketing-services` | Supplier content marketing page. |
| `/about`, `/contact`, `/terms`, `/privacy` | Static public pages. |
| `/industry-news`, `/industry-news/:contentType/:slug` | Industry article routes when `VITE_ENABLE_BLOG=true`; company folders are not exposed in public URLs. |
| `/login`, `/register`, `/dashboard` | Auth routes when `VITE_ENABLE_AUTH=true`. |

### Locale Structure

Current runtime languages are `en` and `zh`.

```text
src/locales/resources.ts        Registers runtime languages
src/locales/en/index.ts         English aggregate
src/locales/zh/index.ts         Chinese aggregate
src/locales/{lang}/common/      Generated industries and countries
src/locales/{lang}/pages/       Page copy and generated catalogue files
```

Generated catalogue files include manufacturer `list.json`, manufacturer detail JSON, product `list.json`, and product detail JSON under each language.

### Supabase Data Layer

Supabase has three roles:

1. Source of truth for manufacturer, product, dictionary, and asset records.
2. Storage backend for images, certificates, documents, and related assets.
3. Live backend for Auth and RFQ submissions.

Public catalogue pages do not query Supabase directly in the browser. They use generated JSON. RFQ and OTP flows use the browser Supabase client.

| Key | Used by | Safety rule |
| --- | --- | --- |
| `VITE_SUPABASE_ANON_KEY` | Browser app | Public, but relies on correct RLS. |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | `src/scripts/*` | Local/server only; never bundle. |
| `SUPABASE_SERVICE_ROLE_KEY` | `supabase_importer/import.js` | Import/admin only; treat as production admin access. |

### Synced Tables

| Table | Output / use |
| --- | --- |
| `countries` | `src/data/countries.json`; country dictionary. |
| `industries` | `src/data/industries.json`; filters and labels. |
| `manufacturers` | Manufacturer list/profile source. |
| `manufacturer_assets` | Manufacturer images, certificates, logos, documents from bucket `assets`. |
| `products` | Product list/detail source. |
| `product_assets` | Product gallery, certificates, documents from bucket `assets`. |
| `rfqs` | Live-only RFQ table; not exported by sync scripts. |

### Important Fields

`manufacturers` commonly includes `id`, localized `name`, descriptions, `advantages`, `slug`, website/contact fields, country/city/address, `established_year`, `factory_area`, `employee_count`, `industries`, `export_markets`, `is_visible`, `seo_data`, `video_link`, `social_media_links`, and timestamps.

`products` commonly includes `id`, `manufacturer_id`, `slug`, `is_visible`, localized `name`, descriptions, `industries`, `advantage`, `technical_parameters`, `seo_data`, `order`, `video_link`, `details`, and timestamps.

Asset tables include relation id, `asset_type`, `alt_text`, `storage_bucket`, `storage_path`, `file_name`, `file_type`, `order`, and timestamps. Frontend asset URLs follow:

```text
/storage/assets/{manufacturer-slug}/{folder}/{file-name}
```

### RFQ Data

Current RFQ insert fields are `first_name`, `last_name`, `company_name`, `country`, `email`, `is_business_email`, `industry`, `parameters`, `additional_notes`, and `is_stealth`.

`parameters` is JSONB-style data containing media, phases, mass flow, temperatures, density, specific heat, conductivity, viscosity, heat load, material, pressure, design temperature, flange standards, and notes. Current code does not implement attachments, automatic matching, supplier dispatch, or supplier response tracking.

### Scripts

| Script | Purpose |
| --- | --- |
| `src/scripts/sync-all.js` | Runs the full sync pipeline. |
| `src/scripts/fetch-data.js` | Pulls selected Supabase tables to `src/data`. |
| `src/scripts/fetch-storage.js` | Downloads Storage bucket assets to `public/storage/assets`. |
| `src/scripts/update-locales.js` | Updates common, manufacturer, and product locale JSON. |
| `src/scripts/update-highlighted-articles.js` | Updates homepage highlighted industry news data. |
| `src/scripts/after-build.js` | Runs post-build tasks: sitemap, deployment files, structured data, noindex, and generated HTML head cleanup. |
| `src/scripts/delete-manufacturers.js` | Manual maintenance helper for deleting configured manufacturers. |
| `src/scripts/remove-locale.js` | Locale maintenance helper. |
| `supabase_importer/import.js` | Imports local curated JSON/assets into Supabase. |

## 中文

本文档说明当前仓库结构，并合并了原先拆出去的 Supabase 数据层说明。

### 顶层结构

```text
content/              Velite Markdown 行业文章源文件
doc/                  项目文档和 Obsidian 业务文档
public/               部署时原样复制的静态文件
src/                  React 应用源码
supabase_importer/    本地 JSON/资产导入 Supabase 的工作流
```

仓库中没有 checked-in 的 `supabase/` migrations 目录。

### 文档集合

当前文档集合保持精简：

| 文件 | 作用 |
| --- | --- |
| `doc/project_overview.md` | 项目、产品、用户和增长方向的主说明。 |
| `doc/project-structure.md` | 仓库、路由、数据层和脚本的主参考。 |
| `doc/seo-geo-keyword-strategy.md` | SEO、GEO、关键词和 Industry News 内容策略。 |
| `doc/obsdian/1. Project Overview (项目介绍).md` | 业务笔记用的中英双语简版项目介绍。 |
| `doc/obsdian/2. Supplier Partnership Proposal（供应商合作方案）.md` | 面向供应商的合作方案和资料要求。 |
| `doc/obsdian/3. Buyer Guide（买家指南）.md` | 面向买家的使用说明和 RFQ 预期。 |
| `doc/obsdian/5. RFQ Specification（询价数据结构）.md` | RFQ 行为和 payload 的详细参考。 |

原供应商数据库结构笔记已删除，因为维护内容已经合并到本文档。

### 根目录文件

| 文件 | 用途 |
| --- | --- |
| `package.json` | 脚本和依赖版本。 |
| `pnpm-lock.yaml` | 标准依赖锁文件。 |
| `vite.config.ts` | Vite、React 插件、alias、HTML 环境变量替换、SSG 路由生成。 |
| `velite.config.ts` | Markdown 文章 schema 和 Velite 输出。 |
| `eslint.config.js` | ESLint flat config。 |
| `tsconfig*.json` | TypeScript 项目配置。 |
| `postcss.config.js` | 将 Tailwind CSS v4 和 Autoprefixer 接入 PostCSS。Tailwind 主题、插件和 dark variant 位于 `src/index.css`。 |
| `index.html` | Vite HTML 入口和 hydration 前环境启动。 |
| `.htaccess` | Apache 静态托管 rewrite、cache、压缩和 headers。 |
| `robots.txt` / `sitemap.xml` | `heatexdirect.com` 的搜索引擎抓取和 sitemap。 |

### `src/` 结构

```text
src/main.tsx                 SSG 应用根和 Provider
src/index.css                Tailwind import、主题 token、全局样式
src/app/                     受 auth 保护的 dashboard 区域
src/assets/                  打包进应用的资源
src/components/              共享 UI、导航、页脚、切换器
src/config/                  运行时配置 helper
src/context/                 Auth 和语言 context
src/data/                    从 Supabase 导出的原始 JSON
src/i18n/                    i18next 初始化
src/layouts/                 页面壳组件
src/lib/supabase/            Supabase 浏览器客户端、auth、RFQ 插入
src/locales/                 UI 翻译和生成的目录 JSON
src/pages/                   路由级页面
src/routes/                  路由配置和保护路由 wrapper
src/scripts/                 数据同步和 locale 生成脚本
src/types/                   全局声明
src/utils/                   路由、主题、语言、class 工具
```

### 路由

| 路由 | 用途 |
| --- | --- |
| `/` | 首页。 |
| `/manufacturers` | 制造商列表。 |
| `/manufacturers/:slug` | 制造商资料页，从厂家 list JSON 生成。 |
| `/products` | 产品列表。 |
| `/products/:manufacturerSlug/:productSlug` | 产品详情页，从产品 list JSON 生成。 |
| `/rfq` | 智能 RFQ 表单。 |
| `/update-your-profile` | 制造商资料更新页。 |
| `/claim-your-profile` | 旧路径，重定向到 `/update-your-profile`。 |
| `/content-marketing-services` | 供应商内容营销页。 |
| `/about`, `/contact`, `/terms`, `/privacy` | 静态公开页面。 |
| `/industry-news`, `/industry-news/:contentType/:slug` | `VITE_ENABLE_BLOG=true` 时启用的行业文章路由；公司文件夹不显示在公开 URL 中。 |
| `/login`, `/register`, `/dashboard` | `VITE_ENABLE_AUTH=true` 时启用的 auth 路由。 |

### Locale 结构

当前运行语言是 `en` 和 `zh`。

```text
src/locales/resources.ts        注册运行语言
src/locales/en/index.ts         英文聚合入口
src/locales/zh/index.ts         中文聚合入口
src/locales/{lang}/common/      生成的行业和国家数据
src/locales/{lang}/pages/       页面文案和生成的目录文件
```

生成的目录文件包括每个语言下的厂家 `list.json`、厂家详情 JSON、产品 `list.json`、产品详情 JSON。

### Supabase 数据层

Supabase 有三个角色：

1. 厂家、产品、字典、资产记录的数据源。
2. 图片、证书、文档和相关资产的 Storage 后端。
3. Auth 和 RFQ 提交的实时后端。

公开目录页面不会在浏览器中直接查询 Supabase，而是使用生成后的 JSON。RFQ 和 OTP 流程使用浏览器 Supabase 客户端。

| Key | 使用方 | 安全规则 |
| --- | --- | --- |
| `VITE_SUPABASE_ANON_KEY` | 浏览器应用 | 可以公开，但依赖正确的 RLS。 |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | `src/scripts/*` | 仅本地/服务端使用，绝不能打包。 |
| `SUPABASE_SERVICE_ROLE_KEY` | `supabase_importer/import.js` | 仅导入/管理使用，视为生产管理员权限。 |

### 同步表

| 表 | 输出 / 用途 |
| --- | --- |
| `countries` | `src/data/countries.json`，国家字典。 |
| `industries` | `src/data/industries.json`，筛选和标签。 |
| `manufacturers` | 制造商列表和资料页来源。 |
| `manufacturer_assets` | 来自 `assets` bucket 的厂家图片、证书、Logo、文档。 |
| `products` | 产品列表和详情页来源。 |
| `product_assets` | 来自 `assets` bucket 的产品图片、证书、文档。 |
| `rfqs` | 实时 RFQ 表，不由同步脚本导出。 |

### 重要字段

`manufacturers` 通常包含 `id`、本地化 `name`、描述、`advantages`、`slug`、网站/联系方式、国家/城市/地址、`established_year`、`factory_area`、`employee_count`、`industries`、`export_markets`、`is_visible`、`seo_data`、`video_link`、`social_media_links` 和时间戳。

`products` 通常包含 `id`、`manufacturer_id`、`slug`、`is_visible`、本地化 `name`、描述、`industries`、`advantage`、`technical_parameters`、`seo_data`、`order`、`video_link`、`details` 和时间戳。

资产表包含关联 id、`asset_type`、`alt_text`、`storage_bucket`、`storage_path`、`file_name`、`file_type`、`order` 和时间戳。前端资产 URL 规则：

```text
/storage/assets/{manufacturer-slug}/{folder}/{file-name}
```

### RFQ 数据

当前 RFQ 插入字段包括 `first_name`、`last_name`、`company_name`、`country`、`email`、`is_business_email`、`industry`、`parameters`、`additional_notes` 和 `is_stealth`。

`parameters` 是 JSONB 风格数据，包含介质、相态、质量流量、温度、密度、比热、导热系数、粘度、热负荷、材料、压力、设计温度、法兰标准和备注。当前代码尚未实现附件、自动匹配、供应商自动发送或供应商回复追踪。

### 脚本

| 脚本 | 用途 |
| --- | --- |
| `src/scripts/sync-all.js` | 运行完整同步流程。 |
| `src/scripts/fetch-data.js` | 拉取指定 Supabase 表到 `src/data`。 |
| `src/scripts/fetch-storage.js` | 下载 Storage bucket 资产到 `public/storage/assets`。 |
| `src/scripts/update-locales.js` | 更新 common、制造商和产品 locale JSON。 |
| `src/scripts/update-highlighted-articles.js` | 更新首页高亮行业新闻数据。 |
| `src/scripts/after-build.js` | 运行构建后任务：sitemap、部署文件、结构化数据、noindex 和生成 HTML 的 head 清理。 |
| `src/scripts/delete-manufacturers.js` | 手动维护 helper，用于删除配置的厂家。 |
| `src/scripts/remove-locale.js` | locale 维护 helper。 |
| `supabase_importer/import.js` | 将本地精选 JSON/资产导入 Supabase。 |