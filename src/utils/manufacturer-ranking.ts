export const PRIMARY_MANUFACTURER_SLUG = "shanghai-heat-transfer-equipment-co-ltd";

export const fallbackManufacturerOrder = 999;

export interface ManufacturerScoreRecord {
  manufacturer_slug: string;
  order: number;
}

export interface ManufacturerScoreFile {
  records: ManufacturerScoreRecord[];
}

export type ManufacturerScoreSource = ManufacturerScoreRecord[] | ManufacturerScoreFile;

export function getManufacturerScoreRecords(source: ManufacturerScoreSource): ManufacturerScoreRecord[] {
  return Array.isArray(source) ? source : source.records;
}

export function getManufacturerSortOrder(
  slug: string | undefined,
  signalsBySlug: Map<string, ManufacturerScoreRecord>,
  fallbackOrder = fallbackManufacturerOrder
) {
  if (slug === PRIMARY_MANUFACTURER_SLUG) {
    return Number.NEGATIVE_INFINITY;
  }

  return slug ? signalsBySlug.get(slug)?.order ?? fallbackOrder : fallbackOrder;
}

export function compareManufacturerOrder(
  first: { slug?: string; name?: string },
  second: { slug?: string; name?: string },
  signalsBySlug: Map<string, ManufacturerScoreRecord>
) {
  const orderDelta = getManufacturerSortOrder(first.slug, signalsBySlug) - getManufacturerSortOrder(second.slug, signalsBySlug);

  if (orderDelta !== 0) {
    return orderDelta;
  }

  return (first.name || "").localeCompare(second.name || "");
}
