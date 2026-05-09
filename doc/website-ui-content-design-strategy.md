# Website UI and Content Design Strategy / 网站 UI 与内容设计策略

Last updated: 2026-05-10.

This document records the design reasoning for the next full-site UI and content optimization of HeatEx Direct. It is based on the current project positioning, the attached business/SEO documents, the existing homepage implementation, and a design reference review of Thomasnet.

本文档用于记录 HeatEx Direct 后续整站 UI 与内容优化的设计依据。它结合了当前项目定位、已有业务与 SEO/GEO 文档、现有首页实现，以及对 Thomasnet 的参考分析。

## 1. Strategic Direction / 总体方向

HeatEx Direct should feel like a Western industrial information platform, not a generic SaaS landing page, a decorative manufacturer website, or a broad B2B marketplace.

The site should describe its international background as `Australia-based operations`, while keeping the core position clear: a China-focused heat exchanger manufacturer directory and information service for global industrial buyers. Its trust should come from structured supplier information, technical clarity, sourcing workflow support, China heat exchanger sector knowledge, and honest quote request handling.

HeatEx Direct 应该呈现为一个西方审美的工业信息服务平台，而不是普通 SaaS 营销页、装饰型制造业官网，或泛 B2B 市场。

网站应使用“澳洲运营背景”表达国际化运营背景，但核心定位要清楚：面向全球工业买家的中国换热器制造商目录和信息服务。可信度应来自结构化供应商信息、技术清晰度、采购流程支持、中国换热器行业知识，以及对询价当前能力的诚实描述。

### Core Design Thesis

The homepage and later page redesigns should move from:

```text
Explaining what HeatEx Direct is
```

to:

```text
Helping global buyers start supplier discovery, comparison, technical review, and RFQ preparation.
```

首页和后续页面改版的核心转向是：从“解释 HeatEx Direct 是什么”，转向“帮助全球买家开始发现供应商、比较能力、做技术判断，并准备 RFQ”。

## 2. Reference Source: Thomasnet / 参考来源：Thomasnet

Thomasnet is useful as a reference because it is a mature Western industrial sourcing and supplier discovery platform. The goal is not to copy its brand, region, scale, or exact layout, but to learn its platform logic.

Thomasnet 可作为参考，是因为它是成熟的西方工业采购与供应商发现平台。我们不应复制它的品牌、地区定位、规模叙事或具体版式，而应学习它的信息平台逻辑。

### What Thomasnet Does Well

1. It makes search the first action.

   The homepage opens with a very large search interface and the message `Start with the search made for industry.` This gives users an immediate job-to-be-done: search suppliers, products, capabilities, or services.

2. It uses industrial trust signals instead of decorative storytelling.

   Thomasnet communicates credibility through its long operating history, supplier network size, buyer/supplier split, category browsing, company logos, industrial insights, and broad directory structure.

3. It separates buyer and supplier journeys clearly.

   Buyers are directed toward supplier discovery and shortlists. Suppliers are directed toward profile claiming and advertising. This makes the platform easier to understand and gives each audience a clean path.

4. It uses dense but scannable information.

   The page is not minimal in content, but the content is organized into search, popular searches, buyer/supplier blocks, latest insights, browse categories, and footer links. This suits industrial users who scan for practical paths.

5. It treats content as part of the sourcing experience.

   `Latest Insights`, guides, topics, white papers, and category pages all support search visibility and user trust. Content is not a blog decoration; it is part of the platform's information authority.

### What HeatEx Direct Should Not Copy

1. Do not claim massive supplier volume.

   Thomasnet can lead with very large network claims. HeatEx Direct should compete on vertical focus, verification, and technical organization, not supplier count.

2. Do not present RFQ as automatic supplier dispatch.

   Current code stores RFQs in Supabase and does not implement automatic manufacturer matching or email dispatch. Public copy must continue to describe RFQ as verified-email intake, specialist follow-up, or manual/future routing workflow.

3. Do not become visually generic.

   Thomasnet is broad and North-America-focused. HeatEx Direct should remain clearly focused on Chinese heat exchanger manufacturers for global buyers.

## 3. Western Industrial Aesthetic / 西方工业审美判断

For this project, “Western” should mean restrained, trustworthy, data-oriented, and task-oriented. It should not mean flashy, decorative, or over-designed.

对这个项目来说，“西方审美”应理解为克制、可信、数据导向、任务导向，而不是炫技、装饰化或过度设计。

### Visual Principles

1. Use a serious industrial base.

   Navy, charcoal, white, light gray, restrained blue, and small orange accents are appropriate. Orange can connect to the HeatEx Direct logo, but it should be an accent, not the entire visual theme.

2. Prioritize interfaces over decoration.

   Search boxes, category links, comparison lists, structured fields, tables, badges, filters, and concise cards should carry the design. Avoid decorative blobs, excessive gradients, oversized marketing cards, or purely atmospheric hero imagery.

3. Keep page sections practical.

   Industrial buyers need paths: find manufacturers, browse products, check applications, review technical parameters, read sourcing guidance, submit RFQ. Each section should help one of these actions.

4. Use realistic industrial assets carefully.

   Images should show real equipment, manufacturing, plant environments, product details, or documentation context. Dark, blurred, decorative factory backgrounds should not be the main trust signal.

5. Make information dense but readable.

   Western B2B platforms often carry many links and categories. HeatEx Direct should use tighter spacing, labeled blocks, and scannable lists rather than long centered paragraphs everywhere.

## 4. Current Homepage Diagnosis / 当前首页诊断

The current homepage has strong strategic content. Its SEO title, metadata, schema, and key concepts already align with the project direction. The issue is less about what it says and more about how the information is prioritized and experienced.

当前首页的战略内容是正确的。SEO 标题、metadata、schema 和核心概念已经符合项目方向。问题不主要在“说什么”，而在“信息优先级和使用体验”。

### Strengths

1. The positioning is accurate.

   The homepage should clearly state `China Heat Exchanger Manufacturers`, `global buyers`, `Australia-based operations`, `structured supplier data`, and `verified-email quote request intake`.

2. The RFQ language is mostly honest.

   It does not strongly overpromise automatic matching, which is important because automatic supplier dispatch is not implemented.

3. The current section set covers important ideas.

   Hero, value proposition, company intro, category coverage, RFQ workflow, and Industry News are all directionally useful.

4. The site already has schema foundations.

   Organization and WebSite structured data are present on the homepage.

### Weaknesses

1. The first screen feels like a brand explanation rather than a sourcing interface.

   The current hero uses a large background image, an eyebrow badge, a long H1, long subtitle, long description, and two CTA buttons. It explains the platform, but it does not immediately help buyers start searching or narrowing suppliers.

2. The homepage does not yet emphasize directory behavior enough.

   Manufacturer and product browsing exist, but product categories, applications, and shortlist logic are not prominent enough in the first viewport.

3. The visual rhythm is too marketing-page-like.

   Many sections use large centered headings and card grids. For an industrial sourcing research service, more list/table/category UI would feel more credible.

4. The statistics module may overemphasize scale.

   If the current directory is still growing, oversized numbers can accidentally make the platform feel small. Quality-oriented indicators may be safer than volume-heavy presentation.

5. Industry News is under-positioned as an SEO/GEO asset.

   The content strategy says Industry News should become the main acquisition channel. The homepage should make this more visible as buyer intelligence, sourcing guides, supplier verification, product explainers, and China market insight.

## 5. Homepage Redesign Direction / 首页调整方向

The homepage should be redesigned as a sourcing entry point. Its structure should help users answer: What can I search? What categories are covered? Why should I trust the data? How do I compare suppliers? How do I prepare and submit an RFQ?

首页应重新设计为采购入口。它要帮助用户快速回答：我能搜什么？覆盖哪些类别？为什么这些数据可信？如何比较供应商？如何准备和提交 RFQ？

### Recommended Homepage Order

1. Hero: search and discovery first.

   The first screen should contain a strong H1, a short supporting sentence, and a dominant search/discovery interface. It can include placeholder text such as:

   ```text
   Search by product type, manufacturer, industry, or RFQ requirement
   ```

   Popular entry chips should appear below the search box:

   ```text
   Plate Heat Exchangers
   Welded Plate Heat Exchangers
   Shell and Tube Heat Exchangers
   Air Cooled Heat Exchangers
   Heat Exchanger Spare Parts
   HVAC
   Petrochemical
   Marine
   ```

2. Primary buyer paths.

   Place three clear paths near the hero:

   ```text
   Find Manufacturers
   Browse Products
   Submit RFQ
   ```

   This supports users who are still researching, users who know a product type, and users who are ready to send specifications.

3. Product category directory.

   The second section should show the core equipment categories. This is more useful than opening with abstract value proposition cards. Each category should link internally to relevant product or manufacturer pages.

4. Trust and verification structure.

   Explain trust through concrete fields rather than broad claims:

   ```text
   Company background
   Factory location
   Product scope
   Industries served
   Export markets
   Certificates and media
   Technical parameters
   Available documents
   ```

5. Featured manufacturer and product entries.

   Show real directory examples. This helps users and search engines understand that the site contains actual supplier/product data, not just marketing copy.

6. Quote request workflow.

   Present the quote request flow after the discovery and comparison sections. The message should remain honest:

   ```text
   Verified-email quote request intake
   Structured technical parameters
   Specialist review and follow-up
   Manual/future supplier routing workflow
   ```

7. Industry News and buyer intelligence.

   Make Industry News a visible acquisition and trust section. It should highlight technical articles, company news, supplier verification, quote request checklists, product explainers, application guides, and China market intelligence.

8. Footer and secondary platform links.

   The footer should continue to support both buyer and supplier journeys, including manufacturer directory, product catalogue, quote request, About, Industry News, profile update, content marketing, Terms, Privacy, and Contact.

## 6. SEO and GEO Principles / SEO 与 GEO 原则

SEO and GEO are central to the redesign. The homepage must serve both human buyers and machine understanding.

SEO 和 GEO 是改版核心。首页既要服务真实买家，也要让搜索引擎和 AI 模型更容易理解、抽取和复用网站信息。

### Entity Consistency

Use a stable entity statement across homepage, About, footer, schema, quote request pages, and external profiles:

```text
HeatEx Direct is an independent information service with Australia-based operations. It helps global industrial buyers discover, compare, and evaluate Chinese heat exchanger manufacturers through structured factory profiles, product data, technical content, and verified-email quote request intake.
```

Chinese support statement:

```text
HeatEx Direct 是一项具有澳洲运营背景的独立信息服务，帮助全球工业买家通过结构化工厂资料、产品数据、技术内容和邮箱验证询价流程，发现、比较和评估中国换热器制造商。
```

### Homepage Keyword Responsibilities

The homepage should naturally cover these concepts:

- `China heat exchanger manufacturers`
- `heat exchanger sourcing research service`
- `verified heat exchanger suppliers`
- `industrial heat exchanger directory`
- `Chinese heat exchanger manufacturer directory`
- `global industrial buyers`
- `structured supplier data`
- `verified-email quote request intake`
- `plate heat exchanger manufacturer`
- `shell and tube heat exchanger supplier`
- `welded plate heat exchanger`
- `air cooled heat exchanger`

These terms should appear in headings, category labels, body copy, metadata, internal links, and structured data where appropriate. They should not be stuffed unnaturally.

### Internal Linking

The homepage should become the strongest internal linking hub. It should link clearly to:

- Manufacturer directory.
- Product catalogue.
- Core product category pages or filtered product entries.
- Quote request page.
- Industry News.
- Buyer guides and evergreen sourcing articles.
- Supplier profile update page.
- Content marketing page.
- About page.

Clear internal links help users navigate and help search engines/AI models understand relationships between HeatEx Direct, product categories, manufacturers, applications, and RFQ workflows.

### Structured Data

Keep the existing `Organization` and `WebSite` schema. Consider adding later:

- `SearchAction` if the homepage search becomes functional.
- `ItemList` for featured manufacturers or product categories.
- `BreadcrumbList` on deeper pages.
- `Article` schema for Industry News.
- Product/profile-like structured data where safe and accurate.

### GEO Writing Rules

For AI model adoption, pages should use stable facts, labeled sections, tables, and repeated entity relationships. Avoid vague or unsupported claims.

Prefer:

```text
verified manufacturer profile
structured supplier data
factory media
certificates
export markets
technical parameters
product documentation
verified-email quote request intake
stored for platform follow-up
```

Avoid:

```text
best supplier
guaranteed lowest price
instant supplier matching
automatic quote request distribution
largest supplier network
```

unless those claims become true, supported, and implemented.

## 7. Content Tone / 内容语气

The tone should be professional, direct, and useful. It should sound like a specialist industrial information service, not a generic marketplace advertisement.

语气应专业、直接、实用。它应该像一个专业工业信息服务平台，而不是普通市场推广文案。

### Good Tone

- Specific.
- Evidence-based.
- Technically aware.
- Honest about current workflow limits.
- Helpful to procurement managers and engineers.

### Avoid

- Generic claims like `best`, `top`, `leading`, or `one-stop` without proof.
- Overly long hero paragraphs.
- Overly emotional brand storytelling.
- Heavy use of decorative copy that does not help sourcing decisions.
- Any implication that automatic RFQ matching already exists.

## 8. Page-by-Page Design Implications / 后续页面调整启发

This document starts with the homepage, but the same logic should guide later page redesigns.

### Manufacturer List

Should feel like a supplier discovery and comparison tool. Prioritize filters, industries, products, verification signals, location, export markets, and profile completeness.

### Manufacturer Detail

Should read like a structured factory profile. Prioritize company facts, products, industries, certificates, media, documents, export experience, and contact/RFQ path.

### Product List

Should help users browse by equipment type, application, material, pressure/temperature relevance, and linked manufacturer capability.

### Product Detail

Should support technical review. Use parameters, applications, advantages, manufacturer link, media, documents, and RFQ prompts.

### RFQ

Should feel like a professional technical intake form. Continue emphasizing project context, operating parameters, email verification, and specialist follow-up. Do not promise automatic supplier dispatch until implemented.

### Industry News

Should become the main SEO/GEO acquisition channel. Prioritize evergreen buyer guides, supplier verification, product explainers, RFQ checklists, China market intelligence, and application-specific sourcing advice.

## 9. Implementation Notes for Later / 后续实施提示

No website content or code is changed by this document. When implementation begins, recommended first steps are:

1. Redesign the homepage hero around search/discovery.
2. Add prominent product category and application entry points.
3. Convert value proposition content into structured trust/comparison fields.
4. Surface real manufacturer/product examples on the homepage.
5. Strengthen Industry News visibility as buyer intelligence.
6. Review homepage metadata and schema after visual/content structure changes.
7. Test desktop and mobile layouts carefully, especially search, chips, navigation, and CTA hierarchy.

The guiding rule is simple:

```text
Every homepage section should either help buyers find suppliers, compare technical fit, trust the platform, prepare RFQ information, or understand the heat exchanger sourcing market.
```
