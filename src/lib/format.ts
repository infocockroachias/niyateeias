/** ₹ formatting using Indian digit grouping, e.g. ₹1,24,999 */
export function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Compact ₹ e.g. ₹1.2L — for stat chips */
export function inrShort(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

/** "2025-09-30" → "30 September 2025" */
export function fmtDate(input: string | Date): string {
  const d = input instanceof Date ? input : new Date(`${input}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(input);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "2025-09-30" → "30 Sep 2025" */
export function fmtDateShort(input: string | Date): string {
  const d = input instanceof Date ? input : new Date(`${input}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(input);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

/** Clamp text to maxWords, used by the enquiry message counter */
export function clampWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  const clipped = words.slice(0, maxWords).join(" ");
  const trailingBreak = text.endsWith("\n") ? "\n" : "";
  return `${clipped}${trailingBreak}`;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
