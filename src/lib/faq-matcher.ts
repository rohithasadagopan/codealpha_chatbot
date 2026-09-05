import { FAQS, type Faq } from "./faq-data";
import { TfidfIndex, jaccard, tokenize } from "./nlp";

const docTokens = FAQS.map((f) =>
  tokenize([f.question, f.variants?.join(" ") ?? "", f.answer].join(" ")),
);
const index = new TfidfIndex(docTokens);

export type Match = { faq: Faq; score: number };

export type MatchResult = {
  best: Match | null;
  suggestions: Match[];
  tokens: string[];
};

const THRESHOLD = 0.12;

export function matchFaq(query: string): MatchResult {
  const tokens = tokenize(query);
  if (tokens.length === 0) return { best: null, suggestions: [], tokens };

  const cosineScores = index.scoreAll(tokens);
  const ranked: Match[] = FAQS.map((faq, i) => {
    const overlap = jaccard(tokens, docTokens[i]!);
    // Blend cosine similarity with token overlap for short queries.
    return { faq, score: cosineScores[i]! * 0.75 + overlap * 0.25 };
  }).sort((a, b) => b.score - a.score);

  const best = ranked[0] && ranked[0].score >= THRESHOLD ? ranked[0] : null;
  const suggestions = ranked.slice(best ? 1 : 0, best ? 4 : 3).filter((m) => m.score > 0.02);

  return { best, suggestions, tokens };
}
