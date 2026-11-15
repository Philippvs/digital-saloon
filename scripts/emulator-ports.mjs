/**
 * Ports for the local Vite app and Firebase Emulator Suite.
 * Deliberately not the Firebase/Vite defaults, so this template can run next to
 * other Firebase projects (bau-connect, meine-gemeinde-app, …).
 * Keep in sync with firebase.json and src/data/emulatorPorts.ts.
 */
export const EMULATOR_PORTS = Object.freeze({
  app: 3100,
  ui: 4100,
  hub: 4410,
  logging: 4510,
  firestore: 8180,
  firestoreWebsocket: 9160,
  auth: 9190,
  storage: 9290,
  functions: 5101,
})

export const ALL_LOCAL_PORTS = Object.freeze(Object.values(EMULATOR_PORTS))

export const EMULATOR_HOST = '127.0.0.1'

/** Demo project id for emulators only — replace in .firebaserc for real projects. */
export const PROJECT_ID = 'demo-react-firebase-template'

export const FUNCTIONS_REGION = 'europe-west8'
