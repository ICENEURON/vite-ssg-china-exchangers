import { supabase } from './client'

export interface RFQSubmissionData {
  first_name: string;
  last_name: string;
  company_name: string | null;
  country: string | null;
  email: string;
  is_business_email: boolean;
  industry: string;
  parameters: any;
  additional_notes: string | null;
  is_stealth: boolean;
}

/**
 * Submits an RFQ to the public.rfqs table.
 */
export async function submitRFQ(data: RFQSubmissionData) {
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
