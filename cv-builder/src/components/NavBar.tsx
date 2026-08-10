"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export default function NavBar() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Image src="/logo.svg" alt="" width={28} height={28} priority />
          CV<span className="text-blue-600">Builder</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-700">
          <Link href="/templates" className="hover:text-black">Templates</Link>
          {user && <Link href="/dashboard" className="hover:text-black">Dashboard</Link>}
          {user && <Link href="/settings" className="hover:text-black">Settings</Link>}
          <Link href="/privacy" className="hover:text-black">Privacy</Link>
          {user ? (
            <button onClick={handleLogout} className="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700">
              Log out
            </button>
          ) : (
            <Link href="/login" className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
