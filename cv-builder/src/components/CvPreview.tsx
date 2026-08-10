"use client";

import { CvTemplate } from "@/data/templates";
import { accentHex } from "@/lib/accent-colors";

interface Props {
  template: CvTemplate;
  content: Record<string, unknown>;
}

// Renders the CV content generically from the template schema.
// Repeatable sections store an array of entry-objects under content[section.key].
export default function CvPreview({ template, content }: Props) {
  const contact = (content.contact as Record<string, string>) || {};

  return (
    <div id="cv-preview" className="mx-auto w-full max-w-[210mm] bg-white p-10 text-neutral-900 shadow-sm">
      <header className="border-b-2 pb-3" style={{ borderColor: accentHex(template.accentColor) }}>
        <h1 className="text-2xl font-bold">{contact.fullName || "Your Name"}</h1>
        <p className="mt-1 text-sm text-neutral-600">
          {[contact.email, contact.phone, contact.location].filter(Boolean).join("  ·  ")}
        </p>
        {contact.links && (
          <p className="mt-1 text-sm text-blue-700">{String(contact.links)}</p>
        )}
      </header>

      {template.sections
        .filter((s) => s.key !== "contact")
        .map((section) => {
          const value = content[section.key];
          if (!value) return null;

          if (section.repeatable && Array.isArray(value)) {
            if (value.length === 0) return null;
            return (
              <section key={section.key} className="mt-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">{section.title}</h2>
                <div className="mt-2 flex flex-col gap-3">
                  {value.map((entry: Record<string, string>, i: number) => (
                    <div key={i}>
                      <div className="flex items-baseline justify-between">
                        <p className="font-medium">
                          {entry.role || entry.name || entry.institution || entry.title || entry.project || entry.activity || entry.org || "Entry"}
                          {entry.org && entry.role ? ` — ${entry.org}` : ""}
                        </p>
                        {entry.dates && <p className="text-xs text-neutral-500">{entry.dates}</p>}
                      </div>
                      {entry.description && <p className="text-sm text-neutral-700 whitespace-pre-line">{entry.description}</p>}
                      {entry.bullets && (
                        <ul className="ml-4 list-disc text-sm text-neutral-700">
                          {String(entry.bullets).split("\n").filter(Boolean).map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          // Non-repeatable section: single object of field values
          const obj = value as Record<string, unknown>;
          const text = Object.values(obj).filter(Boolean).join(" ");
          if (!text) return null;
          return (
            <section key={section.key} className="mt-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">{section.title}</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-neutral-700">{text}</p>
            </section>
          );
        })}
    </div>
  );
}
