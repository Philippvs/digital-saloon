import { initializeApp } from 'firebase-admin/app'
import { onCall, HttpsError } from 'firebase-functions/v2/https'

initializeApp()

/**
 * Minimal callable example. Replace with real domain callables.
 * Always re-check authorization inside functions — Admin SDK bypasses security rules.
 */
export const ping = onCall({ region: 'europe-west8' }, (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in required.')
  }

  return {
    ok: true as const,
    uid: request.auth.uid,
    at: new Date().toISOString(),
  }
})
