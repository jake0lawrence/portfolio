// next.config.js
import mdx from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    // ① expose front-matter as `export const metadata = { … }`
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [],
    // ② opt-in to the faster Rust compiler (Next 14+)
    //    delete if you’re still on <14.0
    // recmaPlugins: [],          // optional
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ③ keep md/mdx first so Next favours .mdx over .tsx when slugs clash
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],

  // ④ You no longer use next-mdx-remote, so drop the transpile
  //    line unless another package requires it.
  // transpilePackages: ['next-mdx-remote'],

  sassOptions: {
    compiler: 'modern',                   // ✅ fine
    silenceDeprecations: ['legacy-js-api'],
  },

  // ⑤ optional—but often handy
  experimental: {
    mdxRs: true,                          // Rust MDX compiler
    typedRoutes: true,                    // route types autogen
  },
};

export default withMDX(nextConfig);
