import dynamic from 'next/dynamic';

const ClientContent = dynamic(() => import('./ClientContent'));

export const metadata = {
  title: 'Habit Tracker — Beta Launch',
  description:
    'Log habits, moods and notes on any device – join the beta!',
};

export default function HabitTrackerBetaPage() {
  return <ClientContent />;
}
