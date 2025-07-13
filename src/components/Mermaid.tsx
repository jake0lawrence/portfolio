'use client';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function Mermaid({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    if (ref.current) {
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="mermaid" ref={ref}>
      {children}
    </div>
  );
}
