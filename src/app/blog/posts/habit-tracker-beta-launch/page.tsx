// src/app/blog/posts/habit-tracker-beta-launch/page.tsx
import dynamic from 'next/dynamic';
const Content = dynamic(() => import('./content.mdx'), { ssr: false });

export const metadata = {
  title: 'Habit Tracker — Beta Launch',
  description: 'Log habits, moods and notes on any device – join the beta!',
};

export default function HabitTrackerBetaPage() {
  return <Content />;
}

