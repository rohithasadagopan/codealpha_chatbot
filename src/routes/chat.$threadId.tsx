import { createFileRoute } from "@tanstack/react-router";
import { FaqChat } from "@/components/FaqChat";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Chat · FAQ Assistant" },
      {
        name: "description",
        content:
          "Ask questions and get instant answers matched from a curated FAQ library using text similarity.",
      },
      { property: "og:title", content: "Chat · FAQ Assistant" },
      {
        property: "og:description",
        content: "Instant answers matched from a curated FAQ library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { threadId } = Route.useParams();
  return <FaqChat threadId={threadId} />;
}
