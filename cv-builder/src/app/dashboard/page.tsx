"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { CvRecord, deleteCv, listCvs } from "@/lib/cv-store";
import { getTemplate } from "@/data/templates";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cvs, setCvs] = useState<CvRecord[]>([]);
  const [loadingCvs, setLoadingCvs] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    listCvs(user.uid).then((list) => {
      setCvs(list);
      setLoadingCvs(false);
    });
  }, [user]);

  async function handleDelete(id: string) {
    if (!user) return;
    if (!confirm("Delete this CV? This can't be undone.")) return;
    await deleteCv(user.uid, id);
    setCvs((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading || loadingCvs) {
    return <div className="mx-auto max-w-6xl px-6 py-16 text-neutral-500">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your CVs</h1>
        <Link href="/templates" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + New CV
        </Link>
      </div>

      {cvs.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
          You haven&apos;t created a CV yet.{" "}
          <Link href="/templates" className="text-blue-600 hover:underline">Browse templates</Link> to get started.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cvs.map((cv) => {
            const template = getTemplate(cv.templateId);
            return (
              <div key={cv.id} className="rounded-lg border border-black/10 bg-white p-5">
                <h3 className="font-semibold">{cv.title || "Untitled CV"}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">{template?.name ?? cv.templateId}</p>
                <div className="mt-4 flex gap-3 text-sm">
                  <Link href={`/builder/${cv.id}`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(cv.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
