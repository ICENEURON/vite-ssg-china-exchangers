# Project Overview / 项目介绍

Last updated: 2026-05-08.

## English

HeatEx Direct is a focused B2B sourcing site for industrial heat exchangers. It is designed to reduce trust friction between global buyers and Chinese manufacturers by presenting structured supplier data, product details, media, certificates, and a verified-email RFQ path.

### Meaning and Goal

The project is not a broad marketplace. It is a vertical directory and sourcing bridge for heat exchangers and related thermal transfer equipment.

HeatEx Direct is operated as a network information services company founded in Melbourne, Australia. It serves global buyers rather than only Australian buyers, with a small three-person team combining senior China heat exchanger industry knowledge, international marketing, and software/data engineering.

The site should help buyers answer:

- Is this company a real manufacturer?
- What products and technical capabilities does it show?
- Does it serve my industry and operating conditions?
- Can I submit a useful RFQ without exposing myself too early?

For suppliers, the site should provide a focused international profile channel and a way to build credibility through structured data and technical content.

### Current Product Scope

- Home page and positioning copy.
- Manufacturer list and profile pages.
- Product list and product detail pages.
- RFQ builder with project context, technical parameters, email OTP verification, and Supabase insert.
- Supplier claim and content marketing pages.
- Contact, About, Terms, Privacy, and optional auth pages.
- Optional Velite-powered industry news pages.

### Current Limits

- RFQs are stored in Supabase but are not automatically matched or emailed to suppliers.
- Public manufacturer/product pages are generated at build time from local JSON, not queried live from the browser.
- Runtime languages are English and Chinese only.
- No Supabase migrations folder is checked in; schema control must happen in Supabase or external migration tooling.

### Core Users

| User | Need | Site responsibility |
| --- | --- | --- |
| Procurement manager | Build a reliable supplier shortlist. | Clear profiles, trust signals, RFQ path. |
| Plant or EPC engineer | Check technical fit. | Product details, parameters, applications, documents. |
| Distributor or integrator | Find long-term factory partners. | Comparable manufacturer capability pages. |
| Manufacturer export team | Gain qualified international visibility. | Accurate profile, claim path, content opportunity. |
| Platform operator | Keep data reliable. | Supabase-driven workflow and documented sync/import process. |

### What Matters Most

| Priority | Why it matters |
| --- | --- |
| Data accuracy | Bad supplier or product data breaks trust. |
| Crawlable static pages | SEO discovery depends on manufacturer and product pages. |
| Technical specificity | Engineers need real parameters and applications, not slogans. |
| Honest RFQ language | The site must not promise automatic routing before it exists. |
| Operational repeatability | Sync, import, lint, and build should be easy to repeat safely. |
| Entity clarity for AI/GEO | Search engines and AI models need stable facts, structured data, and consistent descriptions to reuse the site's information. |

### Growth Direction

Short term:

- Keep docs, lint, and build healthy.
- Improve catalogue completeness before adding many more suppliers.
- Replace starter/demo blog posts with heat exchanger content.
- Use Industry News as the main traffic acquisition channel, focused on buyer guides, supplier verification, product explainers, RFQ checklists, and China market intelligence.
- Make RFQ follow-up operationally clear.

Medium term:

- Add owner notification after RFQ submission.
- Define manual or automatic supplier matching rules.
- Add attachments only after Storage and RLS rules are designed.
- Build supplier claim and technical content workflows into real operations.

Long term:

- Create capability-based supplier matching.
- Track supplier responses and buyer RFQ status.
- Grow SEO through technical guides, product comparison pages, sourcing guides, and manufacturer case studies.

## 中文

HeatEx Direct 是一个聚焦工业换热器的 B2B 采购网站。它通过结构化供应商数据、产品详情、图片/证书资料，以及带邮箱验证的 RFQ 流程，降低海外买家与中国制造商之间的信任成本。

### 项目意义与目标

这个项目不是综合大卖场，而是换热器和相关热交换设备的垂直目录与采购桥梁。

HeatEx Direct 是一家创立于澳大利亚墨尔本的网络信息服务公司，服务对象是全球采购方，而不只限于澳洲市场。团队目前由三人组成，结合了一名非常熟悉中国换热器行业真实情况的资深行业人员、marketing 能力和技术/数据工程能力。

网站应帮助买家回答：

- 这家公司是否是真实制造商？
- 它展示了哪些产品和技术能力？
- 它是否服务我的行业和工况？
- 我能否在早期不完全暴露身份的情况下提交有效 RFQ？

对供应商来说，网站应提供一个聚焦国际买家的展示渠道，并通过结构化资料和技术内容建立可信度。

### 当前产品范围

- 首页和项目定位文案。
- 制造商列表和厂家资料页。
- 产品列表和产品详情页。
- RFQ 构建器：项目背景、技术参数、邮箱 OTP 验证、写入 Supabase。
- 供应商资料认领页和内容营销页。
- 联系、关于、条款、隐私，以及可选的 auth 页面。
- 可选的 Velite 行业资讯页面。

### 当前边界

- RFQ 会存入 Supabase，但不会自动匹配或自动发送给供应商。
- 公开厂家/产品页面在构建时由本地 JSON 生成，不由浏览器实时查询 Supabase。
- 运行语言只有英文和中文。
- 仓库中没有 Supabase migrations 目录；数据库结构需在 Supabase 或外部迁移工具中维护。

### 核心用户

| 用户 | 需求 | 网站责任 |
| --- | --- | --- |
| 采购经理 | 快速建立可靠供应商名单。 | 清晰资料、可信信号、RFQ 路径。 |
| 工厂或 EPC 工程师 | 判断技术匹配度。 | 产品详情、参数、应用、文档。 |
| 经销商或集成商 | 寻找长期工厂伙伴。 | 可比较的厂家能力页面。 |
| 制造商出口团队 | 获得高质量国际曝光。 | 准确资料、认领入口、内容机会。 |
| 平台运营者 | 保持数据可靠。 | Supabase 数据工作流和可重复的同步/导入流程。 |

### 最重要的事

| 优先级 | 原因 |
| --- | --- |
| 数据准确 | 错误厂家或产品资料会直接破坏信任。 |
| 可索引静态页面 | SEO 发现依赖厂家页和产品页。 |
| 技术具体性 | 工程师需要真实参数和应用，而不是口号。 |
| AI/GEO 实体清晰 | 搜索引擎和 AI 大模型需要稳定事实、结构化数据和一致表述，才更容易采纳网站信息。 |

### 增长方向

短期：

- 保持文档、lint、build 健康。
- 先提高目录质量，再扩大供应商数量。
- 把 Industry News 作为主要引流窗口，重点发布买家指南、供应商核验、产品解释、RFQ 清单和中国市场信息。
- 明确 RFQ 后续由谁处理、如何处理。

中期：

- RFQ 提交后增加站点负责人通知。
- 定义人工或自动供应商匹配规则。
- 设计 Storage 和 RLS 后再增加附件功能。
- 将资料认领和技术内容投稿变成真实运营流程。

长期：

- 建立基于能力的供应商匹配。
- 追踪供应商回复和买家 RFQ 状态。
- 通过技术指南、产品对比页、采购指南和厂家案例持续增长 SEO。