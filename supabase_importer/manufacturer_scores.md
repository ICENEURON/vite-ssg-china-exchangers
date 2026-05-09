# Manufacturer Scores Prompt

Use this file as the operating prompt for updating the Supabase `manufacturer_scores` table.

When the user asks to update manufacturer scores based on this document, run the standalone script from the repository root:

```powershell
node supabase_importer/update-manufacturer-scores.js
```

After the Supabase table has been updated, the script reads the refreshed score rows back from Supabase and writes `src/data/manufacturer_scores.json`, which is what the frontend imports.

To sync all data first and then start the local dev server, run:

```powershell
npm run dev:sync
```

For a preview without writing to Supabase, run:

```powershell
node supabase_importer/update-manufacturer-scores.js --dry-run
```

The script reads all company JSON payloads under `supabase_importer/data`, reads asset declarations from each payload, uses `src/data/manufacturer_scores.json` as a fallback for manually maintained fields, counts company content under `content/posts` and `content/news`, calculates score rows, upserts them into `public.manufacturer_scores` by `manufacturer_id`, and writes the refreshed table back into `src/data/manufacturer_scores.json`.

## Required Environment

The script uses `supabase_importer/.env` through `dotenv` and requires:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## Supabase Table

The table already exists as `public.manufacturer_scores`.

```sql
create table public.manufacturer_scores (
  id uuid not null default gen_random_uuid (),
  manufacturer_id uuid not null,
  manufacturer_slug text not null,
  "order" integer not null default 999,
  overall_score integer not null default 0,
  company_intro_score integer not null default 0,
  product_info_score integer not null default 0,
  export_market_score integer not null default 0,
  video_count_score integer not null default 0,
  social_media_score integer not null default 0,
  factory_certification_score integer not null default 0,
  downloadable_document_score integer not null default 0,
  partner_logo_score integer not null default 0,
  response_time_score integer not null default 0,
  published_article_score integer not null default 0,
  response_time text not null default 'n/a'::text,
  published_article_count integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint manufacturer_scores_pkey primary key (id),
  constraint manufacturer_scores_manufacturer_id_key unique (manufacturer_id),
  constraint manufacturer_scores_manufacturer_slug_key unique (manufacturer_slug),
  constraint manufacturer_scores_manufacturer_id_fkey foreign key (manufacturer_id) references manufacturers (id) on delete cascade,
  constraint manufacturer_scores_order_check check (("order" >= 0)),
  constraint manufacturer_scores_overall_score_check check ((overall_score >= 0) and (overall_score <= 100)),
  constraint manufacturer_scores_partner_logo_score_check check ((partner_logo_score >= 0) and (partner_logo_score <= 10)),
  constraint manufacturer_scores_product_info_score_check check ((product_info_score >= 0) and (product_info_score <= 10)),
  constraint manufacturer_scores_published_article_score_check check ((published_article_score >= 0) and (published_article_score <= 10)),
  constraint manufacturer_scores_response_time_score_check check ((response_time_score >= 0) and (response_time_score <= 10)),
  constraint manufacturer_scores_social_media_score_check check ((social_media_score >= 0) and (social_media_score <= 10)),
  constraint manufacturer_scores_company_intro_score_check check ((company_intro_score >= 0) and (company_intro_score <= 10)),
  constraint manufacturer_scores_video_count_score_check check ((video_count_score >= 0) and (video_count_score <= 10)),
  constraint manufacturer_scores_downloadable_document_score_check check ((downloadable_document_score >= 0) and (downloadable_document_score <= 10)),
  constraint manufacturer_scores_export_market_score_check check ((export_market_score >= 0) and (export_market_score <= 10)),
  constraint manufacturer_scores_factory_certification_score_check check ((factory_certification_score >= 0) and (factory_certification_score <= 10))
);
```

## Overall Score Rule

`overall_score` is the sum of 10 scoring dimensions. Each dimension is an integer from 0 to 10, so `overall_score` is an integer from 0 to 100.

```txt
overall_score =
  company_intro_score
  + product_info_score
  + export_market_score
  + video_count_score
  + social_media_score
  + factory_certification_score
  + downloadable_document_score
  + partner_logo_score
  + response_time_score
  + published_article_score
```

## Scoring Logic

### company_intro_score

Range: 1-10.

```txt
start at 1
+2 if full_description has meaningful content
+2 if full_description has multiple paragraphs or rich long-form detail
+2 if advantages has at least 3 items
+1 if established_year, factory_area, and employee_count are present
+1 if website and at least one contact method are present
+1 if industries are present
cap at 10
```

### product_info_score

Range: 1-10.

```txt
1 if no products are available
product_count_score = min(product_count, 4)
product_quality_score = average product completeness score scaled to 0-6
product_info_score = min(10, max(1, product_count_score + product_quality_score))
```

Per-product completeness checks:

```txt
name exists
short_description or full_description exists
at least one product image asset exists
technical_parameters exists
details/FAQ content exists
```

### export_market_score

```txt
export_market_score = min(export_market_count, 10)
```

### video_count_score

```txt
video_count_score = min(company_video_count + product_video_count, 10)
```

### social_media_score

```txt
social_media_score = 10 if at least one visible social media channel exists
social_media_score = 0 otherwise
```

### factory_certification_score

```txt
factory_certification_score = min(company_certification_asset_count, 10)
```

### downloadable_document_score

```txt
downloadable_document_score = min(company_document_asset_count + product_document_asset_count, 10)
```

### partner_logo_score

```txt
partner_logo_score = min(company_customer_logo_asset_count, 10)
```

### response_time and response_time_score

`response_time` is stored as text. If no current response time exists in payload or fallback JSON, use `n/a`.

```txt
within_24h    => 10
within_3_days => 7
within_1_week => 4
n/a           => 0
unknown       => 0 legacy input, normalized to n/a
```

### published_article_count and published_article_score

The script counts markdown content by manufacturer folder under `content/posts/<manufacturer_slug>` and `content/news/<manufacturer_slug>`. Bilingual files with the same filename slug are counted once per section.

```txt
published_article_score = min(published_article_count, 10)
```

## Important Notes

- The script does not modify `supabase_importer/import.js`.
- Run the normal importer first if manufacturer/product rows or asset rows have changed and are not yet in Supabase.
- Then run `node supabase_importer/update-manufacturer-scores.js` to refresh `manufacturer_scores`.
- The script writes `src/data/manufacturer_scores.json` after a successful Supabase update, so a separate sync is not required just for scores.
- The script upserts by `manufacturer_id`, and it skips companies not found in the Supabase `manufacturers` table.