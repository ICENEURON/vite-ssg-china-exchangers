import { getSupabaseClient } from './client'

export type RFQParameters = Record<string, unknown>;

export interface RFQSubmissionData {
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

/**
 * Submits a quote request to the public.rfqs table.
 */
export async function submitRFQ(data: RFQSubmissionData) {
  const supabase = await getSupabaseClient()
  // Debug: Check if we have a valid session
  const { data: { session } } = await supabase.auth.getSession();
  console.log("[submitRFQ] Current session:", session ? "Authenticated" : "Anonymous", session?.user?.email);

  const { data: result, error, status, statusText } = await supabase
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
    hasResult: result != null,
  });

  return result
}
