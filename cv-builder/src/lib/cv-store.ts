"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";

export interface CvRecord {
  id: string;
  templateId: string;
  title: string;
  content: Record<string, unknown>;
  updatedAt?: unknown;
}

const cvsCol = (uid: string) => collection(db, "users", uid, "cvs");

export async function listCvs(uid: string): Promise<CvRecord[]> {
  const snap = await getDocs(cvsCol(uid));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CvRecord, "id">) }));
}

export async function getCv(uid: string, cvId: string): Promise<CvRecord | null> {
  const ref = doc(db, "users", uid, "cvs", cvId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<CvRecord, "id">) };
}

export async function saveCv(uid: string, cv: CvRecord): Promise<void> {
  const ref = doc(db, "users", uid, "cvs", cv.id);
  await setDoc(
    ref,
    { templateId: cv.templateId, title: cv.title, content: cv.content, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function deleteCv(uid: string, cvId: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "cvs", cvId));
}

// ---- Export limit (5 PDFs / day) ----
// Uses a Firestore transaction on a per-day counter document so concurrent
// requests can't push the count past the limit (no race condition).

const DAILY_LIMIT = 5;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

export interface ExportQuota {
  used: number;
  remaining: number;
  limit: number;
}

export async function getExportQuota(uid: string): Promise<ExportQuota> {
  const ref = doc(db, "users", uid, "exportLog", todayKey());
  const snap = await getDoc(ref);
  const used = snap.exists() ? (snap.data().count as number) ?? 0 : 0;
  return { used, remaining: Math.max(0, DAILY_LIMIT - used), limit: DAILY_LIMIT };
}

/**
 * Atomically checks and increments today's export count.
 * Throws if the daily limit has already been reached.
 */
export async function consumeExportCredit(uid: string): Promise<ExportQuota> {
  const ref = doc(db, "users", uid, "exportLog", todayKey());
  const result = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists() ? (snap.data().count as number) ?? 0 : 0;
    if (current >= DAILY_LIMIT) {
      throw new Error("DAILY_LIMIT_REACHED");
    }
    const next = current + 1;
    tx.set(ref, { count: next, lastExportAt: serverTimestamp() }, { merge: true });
    return next;
  });
  return { used: result, remaining: Math.max(0, DAILY_LIMIT - result), limit: DAILY_LIMIT };
}
