export function getReadableAuthError(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes('Invalid login credentials')) {
      return 'Email or password is incorrect, or this account does not exist in the current Supabase project. If you just signed up, confirm your email first.'
    }

    if (error.message.toLowerCase().includes('email not confirmed')) {
      return 'Your account exists, but the email has not been confirmed yet. Check your inbox and spam folder for the Supabase confirmation link.'
    }

    if (error.message.includes('Failed to fetch')) {
      return 'Cannot reach Supabase authentication right now. Check your Supabase project URL in .env and confirm the project is online.'
    }

    return error.message
  }

  return 'An unexpected authentication error occurred.'
}
