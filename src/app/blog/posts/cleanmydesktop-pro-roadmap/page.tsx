import dynamic from 'next/dynamic';

const ClientContent = dynamic(() => import('./ClientContent'));  // <-- forces client bundle

export const metadata = {
  title: 'CleanMyDesktop Pro — 2025 Roadmap',
  description:
    'From smart stacks to AI-powered tagging — here’s everything on deck for Q3–Q4.',
};

export default function RoadmapPage() {
  return <ClientContent />;
}
