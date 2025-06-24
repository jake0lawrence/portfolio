// src/app/blog/posts/cleanmydesktop-pro-roadmap/page.tsx
import dynamic from 'next/dynamic';

// ↓ client-only import; skips SSR so Radix never runs on the server
const Content = dynamic(() => import('./content.mdx'), { ssr: false });

// hand-write the metadata (front-matter stays inside the MDX for tests/SEO)
export const metadata = {
  title: 'CleanMyDesktop Pro — 2025 Roadmap',
  description: 'From smart stacks to AI-powered tagging — here’s everything on deck for Q3–Q4.',
};

export default function RoadmapPage() {
  return <Content />;
}

