# 项目总览：vite-ssg-china-exchangers

## 项目目标

这是一个**中国换热器制造商 B2B 目录网站**，定位为面向海外买家（英文/日文/中文三语）的展示平台。核心功能：

- **制造商目录**：展示中国换热器厂家的公司信息、产品、认证、客户案例等
- **产品目录**：按厂家分类展示产品详情、技术参数、图片
- **行业资讯（Blog）**：多语言文章，通过 Velite 处理 Markdown 内容
- **询盘（RFQ）**：买家向厂家发送采购询盘，写入 Supabase `rfqs` 表
- **用户体系**：注册/登录，RFQ 发送者需是已注册用户

**技术栈核心特点**：采用 **SSG（静态站点生成）+ Supabase 后端** 模式：
- `vite-react-ssg` 在构建时预渲染所有页面（包括每个厂家/产品页面）
- `velite` 将 Markdown blog 文章编译进 `.velite/posts.json`
- 构建产物部署到支持 Apache `.htaccess` 的静态主机

---

## 整体数据流

```
[Supabase DB + Storage]
         │
         │ npm run sync
         ▼
[src/data/*.json]          ← 原始数据（多语言字段混合）
[public/storage/**]        ← 图片、证书、文档等静态资源
         │
         │ generate locales scripts
         ▼
[src/locales/{en,zh}/pages/manufacturers/*.json]
[src/locales/{en,zh}/pages/products/*.json]
[src/locales/{en,zh}/common/{industries,countries}.json]
         │
         │ npm run build (vite-react-ssg)
         ▼
[dist/]  ← 完整预渲染静态站，部署到 Apache 服务器
```

---

## 脚本系统（src/scripts/）

### `npm run sync` → `sync-all.js`
按顺序串行执行以下 5 个脚本：

| 顺序 | 脚本 | 作用 |
|---|---|---|
| 1 | `fetch-data.js` | 从 Supabase DB 拉取 6 张表数据，保存到 `src/data/*.json` |
| 2 | `fetch-storage.js` | 从 Supabase Storage `assets` bucket 下载所有文件到 `public/storage/` |
| 3 | `generate-common-locales.js` | 生成 `{lang}/common/industries.json` 和 `countries.json` |
| 4 | `generate-manufacturer-locales.js` | 生成每个厂家的 `{lang}/pages/manufacturers/{slug}.json` 和 `list.json` |
| 5 | `generate-product-locales.js` | 生成每个产品的 `{lang}/pages/products/{mfg-slug}/{prod-slug}.json` 和 `list.json` |

### 各脚本详解

#### `fetch-data.js`
- 读取项目根目录 `.env.local`（优先用 Service Role Key 绕过 RLS）
- 拉取：`countries`, `industries`, `manufacturers`, `manufacturer_assets`（仅 assets bucket）, `products`, `product_assets`（仅 assets bucket）
- 写入：`src/data/{tableName}.json`
- **注意**：故意不拉取 `rfqs` 表（安全考量）

#### `fetch-storage.js`
- 递归列出并下载 `assets` bucket 的所有文件
- 保存到 `public/storage/assets/{slug}/{folder}/{file}`
- 运行前自动清理旧的 `manufacturer_assets/` 和 `product_assets/` 遗留目录

#### `generate-common-locales.js`
- 支持语言：`en`, `zh`（硬编码）
- 输出：`src/locales/{lang}/common/industries.json` 和 `countries.json`

#### `generate-manufacturer-locales.js`
- 自动检测语言（从 manufacturers.json 的 `name` 字段结构推断）
- 每个厂家输出：`{lang}/pages/manufacturers/{slug}.json`（含产品列表、图片、认证等）
- 全量列表输出：`{lang}/pages/manufacturers/list.json`（SSG 路由生成用）

#### `generate-product-locales.js`
- 每个产品按厂家归档：`{lang}/pages/products/{mfg-slug}/{prod-slug}.json`
- 全量列表输出：`{lang}/pages/products/list.json`（SSG 路由生成用）

---

## supabase_importer/

这是**反向工具**——用于将本地数据**上传**到 Supabase，与 `src/scripts/` 方向相反。

### 职责
将新厂家/产品数据批量导入 Supabase（含图片上传到 Storage）

### 工作方式
1. 读取 `supabase_importer/data/data_payload.json`（自定义导入 payload）
2. 对每个公司：
   - `findOrCreateManufacturer()`：按 `slug` 查找并更新，不存在则插入
   - 上传公司级资产（认证、图片等）到 `assets` bucket 的 `{slug}/{folder}/{file}` 路径
   - 并在 `manufacturer_assets` 表写入记录
3. 对每个产品：
   - `findOrCreateProduct()`：按 `slug` + `manufacturer_id` 查找并更新
   - 上传产品级资产到同一 `assets` bucket
   - 并在 `product_assets` 表写入记录

### 本地资源结构
```
supabase_importer/
  local_assets/
    {company-dir}/
      company_images/
      company_certifications/
      company_customers/
      company_doc/
      product_images/
      product_certifications/
      product_doc/
  data/
    data_payload.json   ← 定义要导入的厂家和产品数据
  import.js             ← 主执行脚本（需在 supabase_importer/ 目录下运行）
  .env                  ← SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
```

### `data_payload.json` 结构
```json
[
  {
    "manufacturer": { /* 厂家所有字段，name/description 用 {en/zh} 对象 */ },
    "local_assets_dir": "company-folder-name",
    "company_assets": [
      { "folder": "company_images", "file_name": "xxx.jpg", "asset_type": "images", "alt_text": {...} }
    ],
    "products": [
      {
        "product": { /* 产品字段 */ },
        "product_assets": [ /* 产品资产 */ ]
      }
    ]
  }
]
```

---

## Supabase 数据库表结构（已知）

| 表名 | 说明 |
|---|---|
| `manufacturers` | 厂家主表，`name`/`description` 等字段为多语言 JSON 对象 |
| `products` | 产品表，关联 `manufacturer_id` |
| `manufacturer_assets` | 厂家资产记录，含 `storage_bucket` + `storage_path` |
| `product_assets` | 产品资产记录，同上 |
| `industries` | 行业分类，`name` 为多语言对象 |
| `countries` | 国家列表 |
| `rfqs` | 询盘表（有 RLS，仅认证用户可插入；脚本不拉取） |
| `users` | 用户表（RFQ 验证时检查邮箱是否存在） |

---

## SSG 路由生成机制（vite.config.ts）

`ssgOptions.includedRoutes` 在构建时：
1. 取所有静态路由（不含 `:param`）
2. 读 `src/locales/en/pages/manufacturers/list.json` → 生成 `/manufacturers/{slug}` 路由
3. 读 `src/locales/en/pages/products/list.json` → 生成 `/products/{mfg-slug}/{prod-slug}` 路由
4. 读 `.velite/posts.json` → 生成 `/industry-news/{slug}` 路由（可通过 `VITE_ENABLE_BLOG=false` 关闭）

> [!IMPORTANT]
> SSG 路由只基于 **英文** locale 的 list.json 生成——中文/日文共用同一套 HTML，由客户端 i18n 切换语言。

---

## 博客系统（Velite）

- 源文件：`content/posts/{lang}/*.md`
- 构建输出：`.velite/posts.json`（包含 HTML content、slug、lang、permalink 等）
- 支持多语言文章（通过文件路径中的 lang 字段区分）
- 代码高亮：`rehype-pretty-code` + Shiki（双主题：light=min-light，dark=dracula）

---

## 环境变量

| 文件 | 用途 |
|---|---|
| `.env.local`（项目根） | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_SERVICE_ROLE_KEY`, `VITE_DEFAULT_LANGUAGE`, `VITE_SUPPORTED_LANGUAGES`, `VITE_ENABLE_LANGUAGE_TOGGLE`, `VITE_ENABLE_THEME_TOGGLE`, `VITE_ENABLE_BLOG` |
| `supabase_importer/.env` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`（独立，用于 import 脚本） |
