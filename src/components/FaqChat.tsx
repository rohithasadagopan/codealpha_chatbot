import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Markdownish } from "./Markdownish";
import { FAQS, TOPICS } from "@/lib/faq-data";
import { matchFaq } from "@/lib/faq-matcher";
import {
  bootstrapThreads,
  newThread,
  saveThreads,
  uid,
  type ChatMessage,
  type Thread,
} from "@/lib/chat-store";

const STARTERS = [
  "Where is my order?",
  "How do I reset my password?",
  "What plans do you offer?",
  "Do you support UPI?",
];

function answerFor(text: string): ChatMessage {
  const { best, suggestions } = matchFaq(text);
  if (!best) {
    return {
      id: uid(),
      role: "bot",
      text:
        "I couldn't find a close match in my FAQ list. Try rephrasing, or ask about one of these topics: " +
        TOPICS.join(", ") +
        ".",
      matched: null,
      suggestions: suggestions.map((s) => s.faq.question),
      createdAt: Date.now(),
    };
  }
  return {
    id: uid(),
    role: "bot",
    text: best.faq.answer,
    matched: {
      question: best.faq.question,
      topic: best.faq.topic,
      score: best.score,
    },
    suggestions: suggestions.map((s) => s.faq.question),
    createdAt: Date.now(),
  };
}

export function FaqChat({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>(() => bootstrapThreads());
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = useMemo(
    () => threads.find((t) => t.id === threadId) ?? null,
    [threads, threadId],
  );

  // A URL pointing at a missing thread falls back to the newest one.
  useEffect(() => {
    if (!active && threads.length > 0) {
      navigate({ to: "/chat/$threadId", params: { threadId: threads[0]!.id }, replace: true });
    }
  }, [active, threads, navigate]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, thinking]);

  const update = useCallback((id: string, fn: (t: Thread) => Thread) => {
    setThreads((prev) => {
      const next = prev.map((t) => (t.id === id ? fn(t) : t));
      next.sort((a, b) => b.updatedAt - a.updatedAt);
      saveThreads(next);
      return next;
    });
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || !active) return;
      const userMsg: ChatMessage = { id: uid(), role: "user", text, createdAt: Date.now() };
      update(active.id, (t) => ({
        ...t,
        title: t.messages.some((m) => m.role === "user") ? t.title : text.slice(0, 40),
        updatedAt: Date.now(),
        messages: [...t.messages, userMsg],
      }));
      setInput("");
      setThinking(true);
      window.setTimeout(() => {
        const reply = answerFor(text);
        update(active.id, (t) => ({
          ...t,
          updatedAt: Date.now(),
          messages: [...t.messages, reply],
        }));
        setThinking(false);
        inputRef.current?.focus();
      }, 350);
    },
    [active, update],
  );

  const createThread = () => {
    const t = newThread();
    setThreads((prev) => {
      const next = [t, ...prev];
      saveThreads(next);
      return next;
    });
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  const deleteThread = (id: string) => {
    const remaining = threads.filter((t) => t.id !== id);
    const next = remaining.length > 0 ? remaining : [newThread()];
    setThreads(next);
    saveThreads(next);
    if (id === threadId) {
      navigate({ to: "/chat/$threadId", params: { threadId: next[0]!.id }, replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Threads */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-sidebar-foreground">FAQ Assistant</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Text matching with TF-IDF &amp; cosine similarity
          </p>
          <button
            onClick={createThread}
            className="mt-4 w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            New chat
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
          {threads.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center gap-1 rounded-lg px-2 ${
                t.id === threadId ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"
              }`}
            >
              <Link
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="flex-1 truncate py-2 text-sm text-sidebar-foreground"
              >
                {t.title}
              </Link>
              <button
                aria-label="Delete chat"
                onClick={() => deleteThread(t.id)}
                className="rounded px-1.5 py-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </nav>
      </aside>

      {/* Conversation */}
      <main className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">{active?.title ?? "Chat"}</h2>
            <p className="text-xs text-muted-foreground">{FAQS.length} FAQs across {TOPICS.length} topics</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBrowser((v) => !v)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
            >
              {showBrowser ? "Hide FAQs" : "Browse FAQs"}
            </button>
            <button
              onClick={createThread}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary md:hidden"
            >
              New
            </button>
          </div>
        </header>

        {showBrowser && (
          <div className="max-h-64 overflow-y-auto border-b border-border bg-card px-4 py-3">
            {TOPICS.map((topic) => (
              <div key={topic} className="mb-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {topic}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {FAQS.filter((f) => f.topic === topic).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => send(f.question)}
                      className="rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary"
                    >
                      {f.question}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            {active?.messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="max-w-[95%]">
                  {m.matched && (
                    <p className="mb-1 text-xs text-muted-foreground">
                      {m.matched.topic} · matched “{m.matched.question}” ·{" "}
                      {(m.matched.score * 100).toFixed(0)}% similarity
                    </p>
                  )}
                  <div className="text-sm leading-relaxed text-foreground">
                    <Markdownish text={m.text} />
                  </div>
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}

            {active && active.messages.filter((m) => m.role === "user").length === 0 && (
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {thinking && <p className="animate-pulse text-sm text-muted-foreground">Matching…</p>}
            <div ref={bottomRef} />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border px-4 py-3"
        >
          <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-border bg-card p-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask a question…"
              className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
