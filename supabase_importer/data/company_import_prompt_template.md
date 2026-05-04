# Reusable Company Import Prompt

将下面这段提示词复制给后续代理使用，并先替换占位符。

## Prompt

你现在要为一个新的中国换热器或工业设备制造商生成完整的 Supabase 导入包。必须严格参考现有样本，并产出与现有上海板换案例相同的 JSON 结构和本地 assets 文件夹结构。

开始之前，先完整查看以下参考文件和目录，再开始生成：

- `supabase_importer/data/shanghai-heat-transfer-equipment-co-ltd.json`
- `supabase_importer/local_assets/shanghai-heat-transfer-equipment-co-ltd/`
- `supabase_importer/import.js`
- `src/data/industries.json`

### 输入信息

- 英文官网：`https://www.accessen.com/`
- 中文官网：`https://www.accessen.cn/`
- 目标公司 slug：`shenghai-accessen-co-ltd`
- 英文公司名（如果已知）：`Shanghai Accessen Co., Ltd.`
- 中文公司名（如果已知）：`上海艾克森股份有限公司`

### 任务目标

你需要直接在工作区中创建以下内容：

1. `supabase_importer/data/{{COMPANY_SLUG}}.json`
2. `supabase_importer/local_assets/{{COMPANY_SLUG}}/company_certifications/`
3. `supabase_importer/local_assets/{{COMPANY_SLUG}}/company_customers/`
4. `supabase_importer/local_assets/{{COMPANY_SLUG}}/company_docs/`
5. `supabase_importer/local_assets/{{COMPANY_SLUG}}/company_images/`
6. `supabase_importer/local_assets/{{COMPANY_SLUG}}/product_certifications/`
7. `supabase_importer/local_assets/{{COMPANY_SLUG}}/product_docs/`
8. `supabase_importer/local_assets/{{COMPANY_SLUG}}/product_images/`

所有图片和文档都必须直接从上述中英文官网下载。不要伪造图片、证书、客户 logo、产品图或 PDF。若官网没有对应内容，则保留 JSON 结构与空文件夹，但不要虚构资源条目。

### 强制约束

1. JSON 最外层必须是数组，且默认包含 1 个公司对象。
2. 顶层对象必须保留这 4 个键：`local_assets_dir`、`manufacturer`、`company_assets`、`products`。
3. `local_assets_dir` 默认与 `manufacturer.slug` 相同，除非有明确需要分离。
4. 字段类型必须与上海板换样本完全一致。不要把字符串改成数字，不要把对象改成数组。
5. 缺失值要保留原结构并置空：
   - 字符串用 `""`
   - 字符串数组用 `[]`
   - 双语对象用 `{ "en": "", "zh": "" }`
   - 双语段落数组用 `{ "en": [], "zh": [] }`
   - 技术参数对象用 `{ "en": {}, "zh": {} }`
   - 详情对象用 `{ "en": [], "zh": [] }`
6. 不允许因为缺字段就删除 key。结构必须完整。
7. 文件夹名必须严格使用这 7 个固定目录名，不允许自定义目录名：
   - `company_certifications`
   - `company_customers`
   - `company_docs`
   - `company_images`
   - `product_certifications`
   - `product_docs`
   - `product_images`
8. JSON 中每个资源条目的 `folder` 值必须与上述目录名完全一致。
9. `file_name` 必须与本地实际保存的文件名完全一致，包括扩展名大小写。
10. 优先使用 ASCII 文件名、小写字母、数字和下划线；不要使用空格和中文文件名。
11. `manufacturer.industries` 和 `product.industries` 必须使用现有行业 ID，先查 `src/data/industries.json` 后再映射。ID 用字符串数组，不要写数字数组。
12. `country_id` 和 `export_markets` 使用 ISO 3166-1 alpha-2 国家代码。
13. 公司级 `seo_data` 结构必须与样本一致，只保留 `meta_title` 和 `meta_description`，且不是双语嵌套对象。
14. 产品级 `seo_data` 必须保留 `en` 和 `zh` 两层。
15. 产品对象里字段名必须保留 `advantage` 单数，不要改成 `advantages`。
16. `order` 按每一类资源各自从 1 开始编号；即使放在同一个数组里，不同子类之间也允许重复编号，这与样本一致。
17. `alt_text` 统一写成清晰的英文描述，保持简洁，可复用到前端。
18. 不要编造认证、客户名单、出口市场、工厂面积、员工人数、成立年份、技术参数。拿不到就留空。
19. 如果中英文官网信息不对齐，优先使用官网原文；另一种语言可基于官网内容做忠实翻译。若仍无法确定，则留空。
20. 如果一个证书或产品认证在多个产品共用，可以复用同一个物理文件名和同一个目录中的文件，不需要复制多份文件。

### 资源类型与目录映射

公司级资源建议按以下规则生成：

- `company_certifications` -> `asset_type: "certificate"`
- `company_customers` -> `asset_type: "logo"`
- `company_images` -> `asset_type: "media"`
- `company_docs` -> `asset_type: "document"`

产品级资源建议按以下规则生成：

- `product_images` -> `asset_type: "gallery_image"`
- `product_certifications` -> `asset_type: "certificate"`
- `product_docs` -> `asset_type: "document"`

如果某一类资源不存在：

- 文件夹仍然要创建
- JSON 中不要伪造该类资源条目
- 对应数组可以为空，或仅保留其他真实存在的资源条目

### 命名规则

1. `manufacturer.slug` 使用英文法定名或常用英文名转 kebab-case。
2. 产品 `slug` 使用英文产品名转 kebab-case。
3. 图片文件名建议使用产品 slug 或公司语义前缀，例如：
   - `company.jpg`
   - `company_2.jpg`
   - `asme.png`
   - `gasketed_plate_heat_exchanger_1.jpg`
4. 同一目录内避免重名；如多个产品共用 `product_images`，文件名前缀必须能区分产品。

### JSON 结构模板

下面是必须保留的结构骨架。你要填充真实内容，但不要改结构。

```json
[
  {
    "local_assets_dir": "{{COMPANY_SLUG}}",
    "manufacturer": {
      "slug": "{{COMPANY_SLUG}}",
      "name": {
        "en": "",
        "zh": ""
      },
      "short_description": {
        "en": "",
        "zh": ""
      },
      "full_description": {
        "en": [],
        "zh": []
      },
      "advantages": {
        "en": [],
        "zh": []
      },
      "website": "",
      "video_link": "",
      "social_media_links": [],
      "email": [],
      "phone": [],
      "country_id": "",
      "country_name": {
        "en": "",
        "zh": ""
      },
      "city": {
        "en": "",
        "zh": ""
      },
      "address": {
        "en": "",
        "zh": ""
      },
      "established_year": "",
      "factory_area": "",
      "employee_count": "",
      "industries": [],
      "export_markets": [],
      "is_visible": true,
      "seo_data": {
        "meta_title": "",
        "meta_description": ""
      }
    },
    "company_assets": [],
    "products": [
      {
        "product": {
          "order": 1,
          "slug": "",
          "is_visible": true,
          "name": {
            "en": "",
            "zh": ""
          },
          "short_description": {
            "en": "",
            "zh": ""
          },
          "full_description": {
            "en": "",
            "zh": ""
          },
          "industries": [],
          "advantage": {
            "en": [],
            "zh": []
          },
          "technical_parameters": {
            "en": {},
            "zh": {}
          },
          "details": {
            "en": [],
            "zh": []
          },
          "video_link": "",
          "seo_data": {
            "en": {
              "meta_title": "",
              "meta_description": ""
            },
            "zh": {
              "meta_title": "",
              "meta_description": ""
            }
          }
        },
        "product_assets": []
      }
    ]
  }
]
```

### 资源条目模板

公司级资源条目示例：

```json
{
  "order": 1,
  "asset_type": "certificate",
  "folder": "company_certifications",
  "file_name": "asme.jpg",
  "alt_text": "ASME Certificate"
}
```

产品级资源条目示例：

```json
{
  "order": 1,
  "asset_type": "gallery_image",
  "folder": "product_images",
  "file_name": "printed_circuit_heat_exchanger_1.jpg",
  "alt_text": "Printed Circuit Heat Exchanger"
}
```

### 采集与整理要求

1. 先完整浏览英文站和中文站，尽量交叉验证公司介绍、产品列表、认证、客户、联系方式、地址、成立时间、工厂面积、员工规模、出口市场等信息。
2. 产品列表以官网真实产品为准，不要机械照搬上海板换的 6 个产品数量。
3. 每个真实存在的产品都要生成一个 `products[]` 条目。
4. 如果官网存在产品页，就优先从产品页抽取：中英文名称、简介、详细介绍、优势、参数、FAQ/说明、视频、SEO 信息、产品图、认证图、PDF 文档。
5. 如果某产品只有图片没有详细文案，仍然保留产品结构，缺的文本字段留空。
6. 如果公司没有 YouTube 或社媒，就保留 `social_media_links: []` 和空 `video_link`。
7. 所有下载的文件必须放入正确目录，并确保 JSON 中引用到的每个 `file_name` 都真实存在于对应目录。
8. 如果官网图片是 webp、svg、png、jpg、jpeg、pdf 等格式，优先保留原始可用格式，除非下载环境必须转换。
9. 下载后检查文件名是否包含乱码、空格或不可见字符；必要时重命名为标准 ASCII 文件名，并同步更新 JSON。

### 最终检查清单

在结束前，逐项确认：

1. `supabase_importer/data/{{COMPANY_SLUG}}.json` 已创建。
2. `supabase_importer/local_assets/{{COMPANY_SLUG}}/` 下 7 个标准子目录全部存在。
3. JSON 中所有顶层和产品层字段结构完整，没有漏 key。
4. JSON 中所有资源条目都能在本地找到真实文件。
5. 没有下载到的内容没有被伪造，只是留空。
6. 所有 `slug`、`file_name`、`folder`、`asset_type` 都与结构约束一致。
7. 所有行业 ID、国家代码、邮箱、电话、社媒链接都经过官网核对。

完成后，只输出一个简短总结，说明：

- 生成了哪些文件
- 抓取到多少个公司级资源
- 抓取到多少个产品
- 哪些字段或资源因为官网缺失而留空