"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, TEMPLATES } from "@/data/templates";
import { accentHex } from "@/lib/accent-colors";

export default function TemplatesPage() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(
    () => (category === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === category)),
    [category]
  );

  function chooseTemplate(templateId: string) {
    router.push(`/builder/new?template=${templateId}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Choose a template</h1>
      <p className="mt-1 text-neutral-600">{TEMPLATES.length} templates, guided for your field or course.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("All")}
          className={`rounded-full px-3 py-1.5 text-sm ${category === "All" ? "bg-neutral-900 text-white" : "bg-neutral-100 hover:bg-neutral-200"}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1.5 text-sm ${category === c ? "bg-neutral-900 text-white" : "bg-neutral-100 hover:bg-neutral-200"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => chooseTemplate(t.id)}
            className="rounded-lg border border-black/10 bg-white p-5 text-left hover:shadow-md transition"
          >
            <div className="h-1.5 w-10 rounded-full" style={{ backgroundColor: accentHex(t.accentColor) }} />
            <h3 className="mt-3 font-semibold">{t.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">{t.category}</p>
            <p className="mt-2 text-sm text-neutral-600">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
