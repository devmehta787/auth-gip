import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getBaseUrl } from "./utils";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const actionCodeSettings = {
  url: `${getBaseUrl()}/v2/sing-in`,
  handleCodeInApp: true,
};

export { app, auth, actionCodeSettings };