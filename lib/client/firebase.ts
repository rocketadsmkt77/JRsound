"use client";

import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";

/**
 * Firebase Web SDK (plano gratuito Spark).
 *
 * Preencha as variáveis NEXT_PUBLIC_FB_* no `.env.local` (valores do
 * console do Firebase — veja TUTORIAL-FIREBASE.md). Sem elas, o site
 * roda em modo local: produtos no localStorage do navegador.
 */

const config = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

export function isCloud(): boolean {
  return !!(config.apiKey && config.projectId);
}

let app: FirebaseApp | null = null;

function getApp(): FirebaseApp {
  if (app) return app;
  app = getApps()[0] ?? initializeApp(config);
  return app;
}

export function getDb(): Firestore {
  return getFirestore(getApp());
}

export function getFbAuth(): Auth {
  return getAuth(getApp());
}
