// Lightweight NLP pipeline: tokenize -> clean -> stopword removal -> stemming
// -> TF-IDF vectors -> cosine similarity. Runs in the browser (no Python deps).

const STOPWORDS = new Set([
  "a","an","the","and","or","but","if","then","than","so","because","as","of","at","by","for",
  "with","about","against","between","into","through","during","before","after","above","below",
  "to","from","up","down","in","out","on","off","over","under","again","further","once","here",
  "there","all","any","both","each","few","more","most","other","some","such","no","nor","not",
  "only","own","same","too","very","can","will","just","should","now","i","me","my","we","our",
  "you","your","he","him","his","she","her","it","its","they","them","their","what","which","who",
  "whom","this","that","these","those","am","is","are","was","were","be","been","being","have",
  "has","had","having","do","does","did","doing","would","could","shall","may","might","must",
  "please","tell","let",
]);

/** Very small suffix stripper in the spirit of the Porter stemmer. */
export function stem(word: string): string {
  let w = word;
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && (w.endsWith("sses") || w.endsWith("shes") || w.endsWith("ches")))
    return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1);
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  if (w.length > 4 && w.endsWith("ly")) w = w.slice(0, -2);
  return w;
}

/** Lowercase, strip punctuation, split, drop stopwords, stem. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem);
}

export type Vector = Map<string, number>;

function termFreq(tokens: string[]): Vector {
  const tf: Vector = new Map();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return tf;
}

export class TfidfIndex {
  private idf = new Map<string, number>();
  private docs: Vector[] = [];

  constructor(documents: string[][]) {
    const n = documents.length;
    const df = new Map<string, number>();
    for (const tokens of documents) {
      for (const t of new Set(tokens)) df.set(t, (df.get(t) ?? 0) + 1);
    }
    for (const [t, c] of df) this.idf.set(t, Math.log((n + 1) / (c + 1)) + 1);
    this.docs = documents.map((tokens) => this.vectorize(tokens));
  }

  vectorize(tokens: string[]): Vector {
    const tf = termFreq(tokens);
    const vec: Vector = new Map();
    const total = tokens.length || 1;
    for (const [t, c] of tf) {
      const idf = this.idf.get(t);
      if (idf === undefined) continue;
      vec.set(t, (c / total) * idf);
    }
    return vec;
  }

  /** Cosine similarity of a query against every indexed document. */
  scoreAll(queryTokens: string[]): number[] {
    const q = this.vectorize(queryTokens);
    return this.docs.map((d) => cosine(q, d));
  }
}

export function cosine(a: Vector, b: Vector): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [, v] of a) na += v * v;
  for (const [k, v] of b) {
    nb += v * v;
    const av = a.get(k);
    if (av !== undefined) dot += av * v;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/** Token overlap fallback, helps very short questions. */
export function jaccard(a: string[], b: string[]): number {
  const sa = new Set(a);
  const sb = new Set(b);
  if (!sa.size || !sb.size) return 0;
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  return inter / (sa.size + sb.size - inter);
}
