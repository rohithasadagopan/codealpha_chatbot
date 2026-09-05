import type { ReactNode } from "react";

/** Renders **bold** and *italic* inline markup without pulling in a parser. */
export function Markdownish({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) nodes.push(<strong key={i++}>{m[1]}</strong>);
    else if (m[2]) nodes.push(<em key={i++}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
