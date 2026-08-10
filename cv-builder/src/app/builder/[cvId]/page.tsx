"use client";

import { useEffect, useMemo, useRef, useState, use as usePromise } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getTemplate } from "@/data/templates";
import { getCv, saveCv, getExportQuota, consumeExportCredit, ExportQuota } from "@/lib/cv-store";
import CvSectionForm from "@/components/CvSectionForm";
import CvPreview from "@/components/CvPreview";

export default function BuilderPage({ params }: { params: Promise<{ cvId: string }> }) {
  const { cvId } = usePromise(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdFromQuery = searchParams.get("template");

  const [templateId, setTemplateId] = useState<string | null>(templateIdFromQuery);
  const [title, setTitle] = useState("Untitled CV");
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [loadingCv, setLoadingCv] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quota, setQuota] = useState<ExportQuota | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      if (cvId !== "new") {
        const existing = await getCv(user.uid, cvId);
        if (existing) {
          setTemplateId(existing.templateId);
          setTitle(existing.title);
          setContent(existing.content);
        }
      }
      const q = await getExportQuota(user.uid);
      setQuota(q);
      setLoadingCv(false);
    })();
  }, [user, cvId]);

  const template = useMemo(() => (templateId ? getTemplate(templateId) : undefined), [templateId]);

  function scheduleSave(nextContent: Record<string, unknown>, nextTitle: string) {
    if (!user || !template) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      const id = cvId === "new" ? crypto.randomUUID() : cvId;
      await saveCv(user.uid, { id, templateId: template.id, title: nextTitle, content: nextContent });
      setSaving(false);
      if (cvId === "new") router.replace(`/builder/${id}`);
    }, 800);
  }

  function updateSection(sectionKey: string, value: unknown) {
    const next = { ...content, [sectionKey]: value };
    setContent(next);
    scheduleSave(next, title);
  }

  function updateTitle(v: string) {
    setTitle(v);
    scheduleSave(content, v);
  }

  async function handleExport() {
    if (!user) return;
    setExportError(null);
    setExporting(true);
    try {
      const nextQuota = await consumeExportCredit(user.uid);
      setQuota(nextQuota);

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const node = document.getElementById("cv-preview");
      if (!node) throw new Error("Preview not found");
      const canvas = await html2canvas(node, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${title || "cv"}.pdf`);
    } catch (err) {
      if (err instanceof Error && err.message === "DAILY_LIMIT_REACHED") {
        setExportError("You've reached today's limit of 5 PDF exports. Try again after midnight UTC.");
      } else {
        setExportError("Export failed. Please try again.");
      }
    } finally {
      setExporting(false);
    }
  }

  if (authLoading || loadingCv) {
    return <div className="mx-auto max-w-6xl px-6 py-16 text-neutral-500">Loading…</div>;
  }

  if (!template) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-neutral-600">Pick a template to start building.</p>
        <button onClick={() => router.push("/templates")} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white">
          Browse templates
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <input
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            className="text-xl font-semibold outline-none"
          />
          <p className="text-sm text-neutral-500">{template.name} · {saving ? "Saving…" : "Saved"}</p>
        </div>
        <div className="flex items-center gap-3">
          {quota && (
            <span className="text-sm text-neutral-600">
              {quota.remaining} of {quota.limit} PDF exports left today
            </span>
          )}
          <button
            onClick={handleExport}
            disabled={exporting || (quota ? quota.remaining <= 0 : false)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? "Exporting…" : "Download PDF"}
          </button>
        </div>
      </div>
      {exportError && <p className="mb-4 text-sm text-red-600">{exportError}</p>}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          {template.sections.map((section) => (
            <CvSectionForm
              key={section.key}
              section={section}
              value={content[section.key]}
              onChange={(v) => updateSection(section.key, v)}
            />
          ))}
        </div>
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <CvPreview template={template} content={content} />
        </div>
      </div>
    </div>
  );
}
