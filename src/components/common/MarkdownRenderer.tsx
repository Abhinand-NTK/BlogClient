import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
// PrismLight + hand-registered languages keeps the highlighter bundle small
// (the full refractor language set is ~600 kB; we only ship the common ones).
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('sql', sql);

interface Props {
  content: string;
}

/**
 * Renders markdown with GFM (tables, task lists), heading slugs (for the TOC),
 * and Prism syntax highlighting for fenced code blocks.
 */
export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-img:rounded-xl prose-a:font-medium">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const raw = String(children);
            // react-markdown v9 no longer passes `inline`; treat fenced blocks
            // (a language class or a multi-line body) as block code.
            const isBlock = Boolean(match) || raw.includes('\n');
            if (isBlock) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] ?? 'text'}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: '0.75rem', fontSize: '0.9rem' }}
                >
                  {raw.replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
            return (
              <code
                className="rounded bg-ink-100 px-1.5 py-0.5 text-[0.85em] font-medium text-brand-700 dark:bg-white/10 dark:text-brand-300"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
