import { getSupabaseClient } from './client'

export type RFQParameters = Record<string, string>;

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
}

/**
 * Submits an RFQ to the public.rfqs table.
 */
export async function submitRFQ(data: RFQSubmissionData) {
  const supabase = await getSupabaseClient()
  // Debug: Check if we have a valid session
  const { data: { session } } = await supabase.auth.getSession();
  console.log("[submitRFQ] Current session:", session ? "Authenticated" : "Anonymous", session?.user?.email);

  const { data: result, error } = await supabase
    .from('rfqs')
    .insert([data])

  if (error) {
    console.error("[submitRFQ] Supabase Error Details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error
  }

  return result
}
