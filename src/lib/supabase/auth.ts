import { supabase } from './client'

/**
 * Sends a 6-digit OTP verification code to the provided email.
 * Supabase handles the generation and email delivery via its Auth module.
 */
export async function sendVerificationOTP(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // Automatically create the user if they don't exist
    }
  })

  if (error) {
    throw error
  }

  return data
}

/**
 * Verifies the 6-digit OTP code sent to the email.
 * If successful, this provisions the user session.
 */
export async function verifyOTPCode(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })

  if (error) {
    throw error
  }

  return data
}
