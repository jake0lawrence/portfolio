import Content, { frontmatter } from './content.mdx';

export const metadata = {
  title: frontmatter.title,
  description: frontmatter.excerpt ?? '',
};

export default function RoadmapPage() {
  return <Content />;
}