'use client';

import { useEffect, useState } from 'react';

type Heading = { id: string; text: string };

export function TableOfContents({ showTitle = true }: { showTitle?: boolean }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLHeadingElement>('.guide-body h2')
    );
    const result = els.map((el, i) => {
      if (!el.id) el.id = `section-${i}`;
      return { id: el.id, text: el.textContent ?? '' };
    });
    setHeadings(result);
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav>
      {showTitle && (
        <p className="mb-2 text-sm font-bold text-slate-800">本文目錄</p>
      )}
      <ul className="space-y-1 text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="block rounded px-2 py-1 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}