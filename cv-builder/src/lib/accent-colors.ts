// Tailwind can't reliably purge dynamically-built class names like `bg-${color}-600`,
// so template accent colors are resolved to real hex values here and applied via inline style.
export const ACCENT_HEX: Record<string, string> = {
  blue: "#2563eb",
  indigo: "#4f46e5",
  sky: "#0284c7",
  cyan: "#0891b2",
  purple: "#9333ea",
  violet: "#7c3aed",
  fuchsia: "#c026d3",
  emerald: "#059669",
  green: "#16a34a",
  teal: "#0d9488",
  amber: "#d97706",
  pink: "#db2777",
  rose: "#e11d48",
  orange: "#ea580c",
  red: "#dc2626",
  yellow: "#ca8a04",
  slate: "#475569",
  lime: "#65a30d",
  gray: "#4b5563",
  neutral: "#525252",
  zinc: "#52525b",
  stone: "#57534e",
};

export function accentHex(color: string): string {
  return ACCENT_HEX[color] ?? "#2563eb";
}
