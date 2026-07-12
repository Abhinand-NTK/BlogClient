export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Mirror of rehype-slug/github-slugger's basic slug rules. */
function slug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * Extract H2/H3 headings from markdown to build a table of contents.
 * Ignores headings inside fenced code blocks.
 */
export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];
  let inCode = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`]/g, '').trim();
      items.push({ id: slug(text), text, level });
    }
  }
  return items;
}
