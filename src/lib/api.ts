"use client";

import { useQuery } from "@tanstack/react-query";

/* ---------------------------------- Types --------------------------------- */

export interface Course {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  mode: "offline" | "online-live" | "recorded" | "hybrid";
  duration: string;
  feeInr: number;
  originalFeeInr: number | null;
  features: string[];
  syllabusHighlights: string[];
  batchSize: string;
  tag: "foundation" | "prelims" | "mains" | "interview" | "opsc" | "csat";
  featured: boolean;
  startDate: string;
  sessionsPerWeek: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: "The Hindu" | "Indian Express" | "PIB" | "Yojana";
  gsTag: "GS1" | "GS2" | "GS3" | "GS4" | "Prelims" | "Essay";
  subject: string;
  date: string; // YYYY-MM-DD
  readMinutes: number;
  tags: string[];
}

export interface NewsDay {
  date: string;
  count: number;
}

export interface NewsResponse {
  days: NewsDay[];
  articles: NewsArticle[];
}

export interface MonthlyDigest {
  id: string;
  month: number;
  year: number;
  fileName: string;
  fileUrl: string;
  status: string;
}

export type ResourceCategory =
  | "pyq"
  | "notes"
  | "booklist"
  | "answer-key"
  | "ebook"
  | "current-affairs";

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  exam: "UPSC" | "OPSC" | "CSAT" | "Optional";
  description: string;
  year: number | null;
  fileType: "pdf" | "docx" | "page";
  pages: number | null;
  downloads: number;
  slug: string;
  contentSummary: string;
}

export interface Ranker {
  id: string;
  name: string;
  year: number;
  rank: number;
  service: string;
  optional: string;
  quote: string;
  avatarSeed: string;
}

export interface Testimonial {
  id: string;
  name: string;
  batch: string;
  role: string;
  quote: string;
  rating: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  priceInr: number;
  mrpInr: number;
  category: string;
  description: string;
  rating: number;
  coverColor: string;
  slug: string;
}

export interface TestSeries {
  id: string;
  title: string;
  exam: string;
  totalTests: number;
  freeTests: number;
  priceInr: number;
  features: string[];
  description: string;
  slug: string;
}

export interface Stat {
  label: string;
  value: string;
  suffix: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Plan {
  id: string;
  name: string;
  priceInr: number;
  period: "month" | "year";
  tagline: string;
  features: string[];
  highlight: boolean;
  aiCredits: string;
}

export interface EvaluationBreakdown {
  content: number;
  structure: number;
  analysis: number;
  examples: number;
  presentation: number;
}

export interface Evaluation {
  scoreInr0to10: number;
  breakdown: EvaluationBreakdown;
  strengths: string[];
  improvements: string[];
  modelOutline: string[];
  verdict: string;
}

export interface McqQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface Bookmark {
  id: string;
  resourceId: string;
  createdAt?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/* --------------------------------- Fetchers -------------------------------- */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function parseError(res: Response): Promise<ApiError> {
  let message = `Request failed (${res.status})`;
  try {
    const data: unknown = await res.json();
    if (data && typeof data === "object" && "error" in data) {
      const err = data as { error?: unknown };
      if (typeof err.error === "string" && err.error) message = err.error;
    }
  } catch {
    /* non-JSON error body */
  }
  if (res.status === 503) {
    message = message.includes("busy")
      ? message
      : "AI service is busy right now — please try again in a moment.";
  }
  return new ApiError(message, res.status);
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, { cache: "no-store", signal });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as T;
}

/* --------------------------- Defensive data helpers ------------------------ */

/** Pull an array out of an API payload that may be { key: [...] } or [...] */
export function pickArray<T>(data: unknown, key: string): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && key in data) {
    const arr = (data as Record<string, unknown>)[key];
    if (Array.isArray(arr)) return arr as T[];
  }
  return [];
}

/* ------------------------------ Query hook ------------------------------- */

export function useApi<T>(path: string | null, extraKey: readonly unknown[] = []) {
  return useQuery<T>({
    queryKey: [path, ...extraKey],
    queryFn: ({ signal }) => apiGet<T>(path as string, signal),
    enabled: !!path,
    staleTime: 60_000,
    retry: 1,
  });
}

export function toErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}
