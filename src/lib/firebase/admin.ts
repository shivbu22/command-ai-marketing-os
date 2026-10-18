import * as admin from 'firebase-admin';

let adminAuth: admin.auth.Auth;
let adminDb: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      adminAuth = admin.auth();
      adminDb = admin.firestore();
    } else {
      console.warn('Firebase admin credentials missing - using mock auth');
      adminAuth = {
         createSessionCookie: async () => 'mock-session-cookie',
         verifySessionCookie: async () => ({ uid: 'mock-user-123' }),
      } as unknown as admin.auth.Auth; // Added type assertion for mock
      adminDb = {} as unknown as admin.firestore.Firestore; // Added type assertion for mock
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
} else {
  adminAuth = admin.auth();
  adminDb = admin.firestore();
}

export { adminAuth, adminDb };
