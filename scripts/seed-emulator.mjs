import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

import { EMULATOR_HOST, EMULATOR_PORTS, PROJECT_ID } from './emulator-ports.mjs'

process.env.FIREBASE_AUTH_EMULATOR_HOST ??= `${EMULATOR_HOST}:${EMULATOR_PORTS.auth}`
process.env.FIRESTORE_EMULATOR_HOST ??= `${EMULATOR_HOST}:${EMULATOR_PORTS.firestore}`

const DEMO_EMAIL = 'demo@example.com'
const DEMO_PASSWORD = 'password123'

async function main() {
  initializeApp({ projectId: PROJECT_ID })
  const auth = getAuth()
  const firestore = getFirestore()

  let user
  try {
    user = await auth.getUserByEmail(DEMO_EMAIL)
  } catch {
    user = await auth.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      displayName: 'Demo User',
      emailVerified: true,
    })
  }

  await firestore.collection('users').doc(user.uid).set(
    {
      email: DEMO_EMAIL,
      displayName: 'Demo User',
      role: 'user',
      createdAt: new Date().toISOString(),
    },
    { merge: true },
  )

  console.log(`[seed] Demo account ready: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
}

main().catch((error) => {
  console.error('[seed] Failed:', error)
  process.exit(1)
})
