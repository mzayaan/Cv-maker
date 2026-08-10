"use client";

import { TemplateSection } from "@/data/templates";

interface Props {
  section: TemplateSection;
  value: unknown;
  onChange: (value: unknown) => void;
}

// Renders the guided form for one section of a template, generically from its schema.
export default function CvSectionForm({ section, value, onChange }: Props) {
  if (section.repeatable) {
    const entries = (Array.isArray(value) ? value : []) as Record<string, string>[];

    function updateEntry(i: number, key: string, v: string) {
      const next = [...entries];
      next[i] = { ...next[i], [key]: v };
      onChange(next);
    }
    function addEntry() {
      onChange([...entries, {}]);
    }
    function removeEntry(i: number) {
      onChange(entries.filter((_, idx) => idx !== i));
    }

    return (
      <div className="rounded-lg border border-black/10 bg-[#F4F4F5] p-5">
        <h3 className="font-semibold">{section.title}</h3>
        <p className="mt-1 text-xs text-neutral-500">{section.guidance}</p>
        <div className="mt-4 flex flex-col gap-4">
          {entries.map((entry, i) => (
            <div key={i} className="rounded-md border border-dashed border-neutral-300 p-4">
              <div className="flex flex-col gap-3">
                {section.fields.map((f) => (
                  <FieldInput
                    key={f.key}
                    field={f}
                    value={entry[f.key] ?? ""}
                    onChange={(v) => updateEntry(i, f.key, v as string)}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeEntry(i)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addEntry}
          className="mt-3 rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100"
        >
          + Add {section.title.toLowerCase()} entry
        </button>
      </div>
    );
  }

  const obj = (value as Record<string, string>) || {};
  function updateField(key: string, v: string) {
    onChange({ ...obj, [key]: v });
  }

  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <h3 className="font-semibold">{section.title}</h3>
      <p className="mt-1 text-xs text-neutral-500">{section.guidance}</p>
      <div className="mt-4 flex flex-col gap-3">
        {section.fields.map((f) => (
          <FieldInput key={f.key} field={f} value={obj[f.key] ?? ""} onChange={(v) => updateField(f.key, v as string)} />
        ))}
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: { key: string; label: string; type: string; placeholder?: string; guidance?: string; required?: boolean };
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      {field.guidance && <p className="text-xs text-neutral-400">{field.guidance}</p>}
      {field.type === "textarea" || field.type === "list" ? (
        <textarea
          rows={field.type === "list" ? 4 : 3}
          value={value}
          placeholder={field.type === "list" ? "One item per line" : field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
        />
      )}
    </div>
  );
}
