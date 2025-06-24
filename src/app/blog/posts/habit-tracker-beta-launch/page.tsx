'use client';

import Content, { frontmatter } from './content.mdx';

export const metadata = {
  title: frontmatter.title,
  description: frontmatter.excerpt ?? '',
};

export const dynamic = 'force-dynamic';

export default function HabitTrackerBetaPage() {
  return <Content />;
}

