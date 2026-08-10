"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateProfile,
  updatePassword,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) setName(user.displayName ?? "");
  }, [loading, user, router]);

  async function handleSaveProfile() {
    if (!user) return;
    setError(null);
    setMessage(null);
    try {
      await updateProfile(user, { displayName: name });
      setMessage("Profile updated.");
    } catch {
      setError("Could not update profile.");
    }
  }

  async function handleChangePassword() {
    if (!user) return;
    setError(null);
    setMessage(null);
    try {
      if (newPassword) {
        await updatePassword(user, newPassword);
        setMessage("Password updated.");
        setNewPassword("");
      } else if (user.email) {
        await sendPasswordResetEmail(auth, user.email);
        setMessage("Password reset email sent.");
      }
    } catch {
      setError("Could not update password. You may need to log in again first.");
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    if (!confirm("This permanently deletes your account and all your CVs. Continue?")) return;
    setError(null);
    try {
      const cvsSnap = await getDocs(collection(db, "users", user.uid, "cvs"));
      await Promise.all(cvsSnap.docs.map((d) => deleteDoc(d.ref)));
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      router.push("/");
    } catch {
      setError("Could not delete account. You may need to log in again first, then retry.");
    }
  }

  if (loading || !user) {
    return <div className="mx-auto max-w-2xl px-6 py-16 text-neutral-500">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <section className="mt-8 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">Profile</h2>
        <div className="mt-3">
          <label className="block text-sm font-medium">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
          />
        </div>
        <div className="mt-3 text-sm text-neutral-500">Email: {user.email}</div>
        <button onClick={handleSaveProfile} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Save profile
        </button>
      </section>

      <section className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">Password</h2>
        <p className="mt-1 text-xs text-neutral-500">Set a new password, or leave blank and we&apos;ll email you a reset link.</p>
        <input
          type="password"
          placeholder="New password (optional)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2"
        />
        <button onClick={handleChangePassword} className="mt-4 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100">
          Update password
        </button>
      </section>

      <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700/80">Permanently delete your account and all your CVs. This can&apos;t be undone.</p>
        <button onClick={handleDeleteAccount} className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          Delete account
        </button>
      </section>
    </div>
  );
}
