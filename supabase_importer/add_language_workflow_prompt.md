# Add a New Website Language

这个提示用于以后复用同一套流程，把网站新增一种语言。执行前先把 `{LANG}`、`{LANG_NAME}`、`{SOURCE_LANG}` 替换成目标值。

## 目标

为网站新增 `{LANG_NAME}` 语言，语言代码为 `{LANG}`，默认从 `{SOURCE_LANG}` 内容翻译。当前项目里 `content/` 和 `src/data/` 都是同步脚本生成物，不要手动改它们。翻译源数据只维护在 `supabase_importer/`，前端只维护语言注册入口。

## 必须修改

1. 翻译并新增 Supabase 导入源文件：
   - `supabase_importer/local_web_pages/{SOURCE_LANG}/**/*.json` -> `supabase_importer/local_web_pages/{LANG}/**/*.json`
   - `supabase_importer/local_contents/**/{SOURCE_LANG}/*.md` -> 同级 `supabase_importer/local_contents/**/{LANG}/*.md`
   - `supabase_importer/data/*.json` 中所有已本地化的 `en`、`zh` 对象，补充 `{LANG}` 字段
   - `supabase_importer/web_data/industries.json` 中所有行业名称对象，补充 `{LANG}` 字段

2. 注册前端语言入口：
   - `src/locales/languages.json` 添加 `{LANG}` 和显示名 `{LANG_NAME}`
   - `src/locales/resources.ts` import `./{LANG}` 并加入 `resources`
   - 新建 `src/locales/{LANG}/index.ts`，结构镜像 `src/locales/en/index.ts` 或 `src/locales/zh/index.ts`

## 严禁修改

- 不要修改 `content/`
- 不要修改 `src/data/`
- 不要生成或提交 `src/locales/{LANG}` 下由 sync 下载的 JSON 文件，只保留 `src/locales/{LANG}/index.ts`
- 不要修改 `.velite/`、`dist/`、`sitemap.xml`
- 不要改同步脚本、页面组件或数据消费逻辑，除非手动 import + sync + build 后证明确实需要

## 翻译规则

- 保留所有文件名、目录名、slug、ID、URL、图片路径、邮箱、电话、单位、数字、国家代码、占位符。
- 保留 i18n 占位符，例如 `{{name}}`、`{{year}}`、`<0>...</0>`。
- JSON 的 key 不翻译，只翻译用户可见的 string value。
- Markdown 正文翻译，frontmatter 的 key 不翻译。
- Markdown frontmatter 必须保留这些英文 key：`title`、`slug`、`date`、`author`、`reviewer`、`readTime`、`excerpt`、`metaTitle`、`metaDescription`、`keywords`、`cover`。
- Markdown frontmatter 中 `slug`、`date`、`cover` 原样复制；`title`、`author`、`reviewer`、`readTime`、`excerpt`、`metaTitle`、`metaDescription`、`keywords` 翻译。
- 品牌名、公司名、产品型号、认证名、标准号谨慎处理，通常保留原文或采用行业通用译名。
- 翻译要符合工业品 B2B 网站语气，避免口语化和营销夸张。

## 推荐执行顺序

1. 先用 `rg --files supabase_importer` 盘点所有语言相关文件。
2. 从 `{SOURCE_LANG}` 生成 `supabase_importer/local_web_pages/{LANG}`。
3. 从 `{SOURCE_LANG}` 生成 `supabase_importer/local_contents/**/{LANG}`。
4. 给 `supabase_importer/data/*.json` 和 `supabase_importer/web_data/industries.json` 补 `{LANG}` 字段。
5. 只添加 `src/locales/{LANG}/index.ts`，不要添加其它 `src/locales/{LANG}` JSON。
6. 更新 `src/locales/languages.json` 和 `src/locales/resources.ts`。
7. 检查 git 状态，确认没有 `content/`、`src/data/`、`.velite/`、`sitemap.xml`、`dist/` 变化。

## 用户手动验证流程

用户运行现有导入和同步流程后再验证：

```bash
node supabase_importer/import.js
pnpm run sync
pnpm run lint
pnpm run build
```

如果项目里的 sync 命令名称不同，以当前 `package.json` 为准。

## 验收标准

- `supabase_importer/local_web_pages/{LANG}` 文件数量和 `{SOURCE_LANG}` 一致。
- `supabase_importer/local_contents/**/{LANG}` Markdown 数量和 `{SOURCE_LANG}` 一致。
- `supabase_importer/data/*.json` 里的本地化对象都包含 `{LANG}`。
- `supabase_importer/web_data/industries.json` 所有行业名称都包含 `{LANG}`。
- `src/locales/languages.json`、`src/locales/resources.ts`、`src/locales/{LANG}/index.ts` 已注册新语言。
- 手动 import + sync 后，`src/locales/{LANG}` JSON 和 `content/**/{LANG}` 由脚本生成。
- `pnpm run build` 通过，并且目标语言页面可访问。
