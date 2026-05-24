# Add Spanish Website Language

这个提示用于把网站新增西班牙语。目标语言代码为 `es`，显示名为 `Español`，默认从英文 `en` 内容翻译。当前项目里 `content/` 和 `src/data/` 都是同步脚本生成物，不要手动改它们。翻译源数据只维护在 `supabase_importer/`，前端只维护语言注册入口。

## 目标

为 HeatEx Direct 新增西班牙语站点内容、Supabase 导入源、前端语言注册入口，并确保后续 `pnpm run import`、`pnpm run sync`、`pnpm run build` 可以生成西语页面。

## 必须修改

1. 翻译并新增 Supabase 导入源文件：
   - `supabase_importer/local_web_pages/en/**/*.json` -> `supabase_importer/local_web_pages/es/**/*.json`
   - `supabase_importer/local_contents/**/en/*.md` -> 同级 `es/*.md`
   - `supabase_importer/data/*.json` 中所有已本地化的 `en`、`zh`、`ru` 对象，补充 `es` 字段
   - `supabase_importer/web_data/industries.json` 中所有行业名称对象，补充 `es` 字段

2. 注册前端语言入口：
   - `src/locales/languages.json` 添加 `es` 和显示名 `Español`
   - `src/locales/resources.ts` import `./es` 并加入 `resources`
   - 新建 `src/locales/es/index.ts`。不要静态 import 还未 sync 下载的 JSON；用 `import.meta.glob('./**/*.json')` 读取已有文件，并在缺文件时回退到 `src/locales/en`
   - Cookie consent 文案是手工维护的组件文案，需要新增 `src/locales/es/components/cookie.json`

3. 检查硬编码语言逻辑：
   - 搜索 `en | zh`、`language === 'zh'`、`supportedLanguages = ['en', 'zh']`、`['en', 'zh']`、`ru` 等语言硬编码
   - 如发现会影响 `es` 的代码，改为从 `resources` 或 `src/locales/languages.json` 推导
   - Cookie consent、导航、语言切换、路径生成、sync 脚本都必须支持 `es`

## 严禁修改

- 不要手动修改 `content/`
- 不要手动修改 `src/data/`
- 不要生成或提交 `src/locales/es` 下由 sync 下载的 JSON 文件；只保留 `src/locales/es/index.ts` 和手工维护的 `src/locales/es/components/cookie.json`
- 不要修改 `.velite/`、`dist/`、`sitemap.xml`
- 不要改页面组件或数据消费逻辑，除非手动 import + sync + build 后证明确实有语言硬编码

## 翻译规则

- 保留所有文件名、目录名、slug、ID、URL、图片路径、邮箱、电话、单位、数字、国家代码、占位符。
- 保留 i18n 占位符，例如 `{{name}}`、`{{year}}`、`<0>...</0>`。
- JSON 的 key 不翻译，只翻译用户可见的 string value。
- Markdown 正文翻译，frontmatter 的 key 不翻译。
- Markdown frontmatter 必须保留这些英文 key：`title`、`slug`、`date`、`author`、`reviewer`、`readTime`、`excerpt`、`metaTitle`、`metaDescription`、`keywords`、`cover`。
- Markdown frontmatter 中 `slug`、`date`、`cover` 原样复制；`title`、`author`、`reviewer`、`readTime`、`excerpt`、`metaTitle`、`metaDescription`、`keywords` 翻译。
- 品牌名、公司名、产品型号、认证名、标准号谨慎处理，通常保留原文或采用行业通用译名。
- 翻译要符合工业品 B2B 网站语气，使用自然、专业的西班牙语，避免口语化和营销夸张。
- 面向国际 B2B 买家时，优先使用中性拉美/国际西语表达，避免过强地区化用词。

## 公司和产品数据结构规则

修改 `supabase_importer/data/*.json` 时，必须保留现有公司导入结构。不要因为补 `es` 字段而改变字段类型、删除 key 或重排资源目录。

### 顶层结构

每个公司 JSON 最外层必须是数组，且公司对象保留这 4 个键：

- `local_assets_dir`
- `manufacturer`
- `company_assets`
- `products`

`local_assets_dir` 默认与 `manufacturer.slug` 相同，除非现有文件已经有明确分离。

### 本地化字段

- 已有 `{ "en": "", "zh": "" }` 或 `{ "en": "", "zh": "", "ru": "" }` 的字段，补充 `"es": ""` 并翻译。
- 已有 `{ "en": [], "zh": [] }` 或 `{ "en": [], "zh": [], "ru": [] }` 的段落数组，补充 `"es": []` 并翻译。
- 已有 `{ "en": {}, "zh": {} }` 或 `{ "en": {}, "zh": {}, "ru": {} }` 的技术参数对象，补充 `"es": {}` 并翻译键值中的用户可见内容。
- 产品级 `seo_data` 必须保留语言层级，并补充 `es`。
- 公司级 `seo_data` 若现有结构只有 `meta_title` 和 `meta_description`，不要改成多语言嵌套；按现有结构处理。

### 资源目录和资源条目

只使用这些固定目录名，不允许自定义目录名：

- `company_certifications`
- `company_customers`
- `company_docs`
- `company_images`
- `product_certifications`
- `product_docs`
- `product_images`

资源条目规则：

- `folder` 必须与上述目录名完全一致。
- `file_name` 必须与本地实际保存的文件名完全一致，包括扩展名大小写。
- 文件名优先使用 ASCII、小写字母、数字和下划线；不要使用空格和中文文件名。
- `order` 按每一类资源各自从 1 开始编号；不同子类之间允许重复编号。
- `alt_text` 保持清晰、简洁，通常写英文即可，除非现有文件已经多语言化。
- 不要伪造图片、证书、客户 logo、产品图或文档。

### 产品保留门槛

- 不要保留“只有产品名、SEO 或图片”的占位产品。
- 产品至少要有一段真实文字介绍：`short_description` 或 `full_description` 至少一项非空。
- 同时还需要至少一个补充内容块非空：`advantage`、`technical_parameters`、`details` 或真实 `product_docs` 其一满足。
- `seo_data` 不算产品详情，不能作为保留空产品的理由。
- 产品对象里字段名必须保留 `advantage` 单数，不要改成 `advantages`。

### 文档和图片限制

- 文档只保留 `pdf`、`doc`、`docx`，单个文件必须小于 50MB。
- 不要保留 `zip`、`rar`、`7z`、`exe` 或其他非文档格式。
- 产品图必须是方图或横图，宽度必须大于或等于高度；竖图不要写入 `product_assets`。
- 只有真正公司级的文档才能放在 `company_docs`。
- 产品手册、产品样本、产品说明书、产品规格书必须放到对应产品的 `product_docs`，并挂到该产品的 `product_assets`。
- 如果文档不能明确匹配到某个已保留产品，则删除，不要硬挂到某个产品或保留在 `company_docs`。

### 业务字段规则

- `manufacturer.industries` 和 `product.industries` 必须使用现有行业 ID，先查 `src/data/industries.json` 或 `supabase_importer/web_data/industries.json` 后再映射。ID 用字符串数组，不要写数字数组。
- `country_id` 和 `export_markets` 使用 ISO 3166-1 alpha-2 国家代码。
- 不要编造认证、客户名单、出口市场、工厂面积、员工人数、成立年份、技术参数。
- 如果中英文/俄文信息不对齐，优先使用官网原文或现有可信字段；无法确定则留空。

## 推荐执行顺序

1. 用 `rg --files supabase_importer` 盘点所有语言相关文件。
2. 从 `en` 生成 `supabase_importer/local_web_pages/es`，逐个翻译 JSON 用户可见字符串。
3. 从 `en` 生成 `supabase_importer/local_contents/**/es`，逐个翻译 Markdown 正文和允许翻译的 frontmatter 值。
4. 给 `supabase_importer/data/*.json` 里的本地化对象补 `es` 字段。
5. 给 `supabase_importer/web_data/industries.json` 的行业名称补 `es` 字段。
6. 添加 `src/locales/es/index.ts` 和 `src/locales/es/components/cookie.json`；不要添加其它由 sync 下载的 `src/locales/es` JSON。
7. 更新 `src/locales/languages.json` 和 `src/locales/resources.ts`。
8. 检查 `supabase_importer/import.js` 会导入公司/产品数据。默认应导入；如只想上传 Storage，可临时设置 `SHOULD_IMPORT_MANUFACTURER_DATA=false`。
9. 跑 `pnpm exec tsc -b`。如果发现语言硬编码，再做最小必要修复。
10. 由用户运行完整 import/sync/build 后，再检查是否有生成物异常。
11. 检查 git 状态，确认没有手动修改 `content/`、`src/data/`、`.velite/`、`sitemap.xml`、`dist/`。

## 用户手动验证流程

用户运行现有导入和同步流程后再验证：

```bash
pnpm run import
pnpm run sync
pnpm run lint
pnpm run build
```

如果项目里的命令名称不同，以当前 `package.json` 为准。

## 验收标准

- `supabase_importer/local_web_pages/es` 文件数量和 `en` 一致。
- `supabase_importer/local_contents/**/es` Markdown 数量和 `en` 一致。
- `supabase_importer/data/*.json` 里的本地化对象都包含 `es`。
- `supabase_importer/web_data/industries.json` 所有行业名称都包含 `es`。
- `src/locales/languages.json`、`src/locales/resources.ts`、`src/locales/es/index.ts` 已注册西班牙语。
- 手动 import + sync 后，`src/locales/es` JSON 和 `content/**/es` 由脚本生成。
- `pnpm run build` 通过，并且 `/es`、`/es/privacy` 等目标语言页面可访问。
- Cookie consent、导航、页脚、RFQ、登录/注册、隐私/条款页面能显示西班牙语或正确回退，不出现硬编码只支持 `en/zh/ru` 的问题。

## 结束输出

完成后只输出简短总结，说明：

- 新增或修改了哪些语言入口文件
- 生成了多少个 `local_web_pages/es` JSON
- 生成了多少个 `local_contents/**/es` Markdown
- 哪些 `supabase_importer/data/*.json` 和 `web_data/industries.json` 已补 `es`
- 哪些内容因为源数据缺失而只能保留空值或回退
- 已运行哪些验证命令，以及是否通过
