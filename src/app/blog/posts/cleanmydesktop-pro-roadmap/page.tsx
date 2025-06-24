// src/app/blog/posts/cleanmydesktop-pro-roadmap/page.tsx
'use client';

export { frontmatter } from './content.mdx';   // ← add this line
export const dynamic = 'force-dynamic';        // optional, keeps CSR only

import Content from './content.mdx';

export default function RoadmapPage() {
  return <Content />;
}