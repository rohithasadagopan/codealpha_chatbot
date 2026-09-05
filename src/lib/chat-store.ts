export type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  /** Matched FAQ question + confidence, for bot messages. */
  matched?: { question: string; topic: string; score: number } | null;
  suggestions?: string[];
  createdAt: number;
};

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};

const KEY = "faqbot.threads.v1";

export const isBrowser = () => typeof window !== "undefined";

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function greeting(): ChatMessage {
  return {
    id: uid(),
    role: "bot",
    text: "Hi! I'm a FAQ assistant. Ask me about orders, payments, your account, privacy, subscriptions, support or the app.",
    createdAt: Date.now(),
  };
}

export function newThread(): Thread {
  return { id: uid(), title: "New chat", updatedAt: Date.now(), messages: [greeting()] };
}

export function loadThreads(): Thread[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: Thread[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(threads));
  } catch {
    /* storage full or blocked */
  }
}

/** Reads storage, creating and persisting a first thread when empty. Idempotent. */
export function bootstrapThreads(): Thread[] {
  const existing = loadThreads();
  if (existing.length > 0) return existing;
  const seeded = [newThread()];
  saveThreads(seeded);
  return seeded;
}
