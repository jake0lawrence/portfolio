// src/mdx.d.ts
declare module '*.mdx' {
  /** Front-matter (title, excerpt, tags, …) injected by the MDX loader */
  export const frontmatter: Record<string, any>;   // ← add this line
  /** The MDX content itself as a React component */
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
