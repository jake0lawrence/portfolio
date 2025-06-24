'use client';

import Content, { frontmatter } from './content.mdx';

export const metadata = {
  title: frontmatter.title,
  description: frontmatter.excerpt ?? '',
};

export const dynamic = 'force-dynamic';  // keeps CSR only

export default function RoadmapPage() {
  return <Content />;
}

