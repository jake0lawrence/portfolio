// src/app/blog/posts/habit-tracker-beta-launch/page.tsx
'use client';

export { frontmatter } from './content.mdx';
export const dynamic = 'force-dynamic';

import Content from './content.mdx';

export default function HabitTrackerBetaPage() {
  return <Content />;
}