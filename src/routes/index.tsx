import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { bootstrapThreads } from "@/lib/chat-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FAQ Assistant · Instant answers to common questions" },
      {
        name: "description",
        content:
          "A chatbot that matches your question against a curated FAQ library using tokenization, TF-IDF and cosine similarity.",
      },
      { property: "og:title", content: "FAQ Assistant" },
      {
        property: "og:description",
        content: "Ask a question, get the closest matching FAQ answer instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const threads = bootstrapThreads();
    navigate({
      to: "/chat/$threadId",
      params: { threadId: threads[0]!.id },
      replace: true,
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">FAQ Assistant</h1>
        <p className="mt-2 text-sm text-muted-foreground">Opening your chat…</p>
      </div>
    </div>
  );
}
