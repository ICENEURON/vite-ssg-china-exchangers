import { getSupabaseClient } from './client'
import { RFQ_ATTACHMENT_BUCKET, sanitizeRfqAttachmentFileName } from '../rfq/attachments'

export type RFQParameters = Record<string, unknown>;
export type RFQInsertedRow = { id: string | number | null };
export type RFQUploadedFile = {
  name: string;
  path: string;
  size: number;
  type: string;
};

export interface RFQSubmissionData {
  id?: string;
  first_name: string;
  last_name: string;
  company_name: string | null;
  country: string | null;
  email: string;
  is_business_email: boolean;
  industry: string;
  parameters: RFQParameters;
  additional_notes: string | null;
  is_stealth: boolean;
  source_url: string | null;
  is_targeting_source_manufacturer: boolean;
}

export interface RFQEventData {
  draft_id: string;
  visitor_id: string;
  event_name: string;
  utm_source: string | null;
  payload?: RFQParameters | null;
  rfq_id?: string | number | null;
}

function getUniqueRfqAttachmentStorageName(fileName: string, usedNames: Set<string>) {
  const safeFileName = sanitizeRfqAttachmentFileName(fileName);
  const extensionStart = safeFileName.lastIndexOf('.');
  const baseName = extensionStart > 0 ? safeFileName.slice(0, extensionStart) : safeFileName;
  const extension = extensionStart > 0 ? safeFileName.slice(extensionStart) : '';
  let candidate = safeFileName;
  let suffix = 2;

  while (usedNames.has(candidate.toLowerCase())) {
    candidate = `${baseName}-${suffix}${extension}`;
    suffix += 1;
  }

  usedNames.add(candidate.toLowerCase());
  return candidate;
}

/**
 * Submits a quote request to the public.rfqs table.
 */
export async function submitRFQ(data: RFQSubmissionData): Promise<RFQInsertedRow> {
  const supabase = await getSupabaseClient()
  // Debug: Check if we have a valid session
  const { data: { session } } = await supabase.auth.getSession();
  console.log("[submitRFQ] Current session:", session ? "Authenticated" : "Anonymous", session?.user?.email);

  const { error, status, statusText } = await supabase
    .from('rfqs')
    .insert([data])

  if (error) {
    console.error("[submitRFQ] Supabase Error Details:", {
      status,
      statusText,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error
  }

  console.log("[submitRFQ] Insert accepted:", {
    status,
    statusText,
    id: data.id || null,
  });

  return { id: data.id || null }
}

export async function recordRFQEvent(data: RFQEventData) {
  const supabase = await getSupabaseClient()
  const { error } = await supabase
    .from('rfq_events')
    .insert([{
      draft_id: data.draft_id,
      visitor_id: data.visitor_id,
      event_name: data.event_name,
      utm_source: data.utm_source,
      payload: data.payload || null,
      rfq_id: data.rfq_id == null ? null : String(data.rfq_id),
    }])

  if (error) throw error
}

export async function uploadRFQFiles(rfqId: string | number, files: File[]): Promise<RFQUploadedFile[]> {
  if (files.length === 0) return [];

  const supabase = await getSupabaseClient()
  const uploadedFiles: RFQUploadedFile[] = [];
  const folderName = String(rfqId);
  const usedStorageNames = new Set<string>();

  for (const file of files) {
    const storageFileName = getUniqueRfqAttachmentStorageName(file.name, usedStorageNames);
    const storagePath = `${folderName}/${storageFileName}`;
    const { data, error } = await supabase.storage
      .from(RFQ_ATTACHMENT_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        contentType: file.type || undefined,
        upsert: false,
      });

    if (error) throw error;

    uploadedFiles.push({
      name: file.name,
      path: data.path,
      size: file.size,
      type: file.type || 'unknown',
    });
  }

  return uploadedFiles;
}
