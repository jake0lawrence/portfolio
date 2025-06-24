import { frontmatter } from './content.mdx';
import dynamic from 'next/dynamic';

const ClientContent = dynamic(() => import('./ClientContent'));

export const metadata = {
  title: frontmatter.title,
  description: frontmatter.excerpt ?? '',
};

export default function RoadmapPage() {
  return <ClientContent />;
}
