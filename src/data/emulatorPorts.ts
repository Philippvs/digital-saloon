/** Keep in sync with scripts/emulator-ports.mjs and firebase.json. */
export const emulatorPorts = {
  app: 3100,
  ui: 4100,
  hub: 4410,
  logging: 4510,
  firestore: 8180,
  firestoreWebsocket: 9160,
  auth: 9190,
  storage: 9290,
  functions: 5101,
} as const

export const emulatorHost = '127.0.0.1' as const

export const demoProjectId = 'demo-react-firebase-template' as const

export const functionsRegion = 'europe-west8' as const
