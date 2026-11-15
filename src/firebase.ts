import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions, type Functions } from 'firebase/functions'
import { connectStorageEmulator, getStorage, type FirebaseStorage } from 'firebase/storage'

import { demoProjectId, emulatorHost, emulatorPorts, functionsRegion } from './data/emulatorPorts'

function readConfig(): FirebaseOptions {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'demo-api-key',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? `${demoProjectId}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? demoProjectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? `${demoProjectId}.appspot.com`,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '0',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:0:web:demo',
  }
}

/** True for `pnpm dev:local`; never set this for production builds. */
export const usesEmulators: boolean = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'

export const firebaseApp: FirebaseApp = initializeApp(readConfig())
export const firebaseAuth: Auth = getAuth(firebaseApp)
export const firestore: Firestore = getFirestore(firebaseApp)
export const firebaseStorage: FirebaseStorage = getStorage(firebaseApp)
export const firebaseFunctions: Functions = getFunctions(firebaseApp, functionsRegion)

if (usesEmulators) {
  connectAuthEmulator(firebaseAuth, `http://${emulatorHost}:${emulatorPorts.auth}`, {
    disableWarnings: true,
  })
  connectFirestoreEmulator(firestore, emulatorHost, emulatorPorts.firestore)
  connectStorageEmulator(firebaseStorage, emulatorHost, emulatorPorts.storage)
  connectFunctionsEmulator(firebaseFunctions, emulatorHost, emulatorPorts.functions)
}
