import mdx from '@next/mdx';
import remarkGfm from 'remark-gfm';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow custom build directory via NEXT_BUILD_DIR for atomic deploys
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  // Put .md/.mdx first so they win if a slug collides with a .tsx file
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],

  // `next-mdx-remote` no longer used → drop transpilePackages
  sassOptions: {
    compiler: 'modern',
    silenceDeprecations: ['legacy-js-api'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default withMDX(nextConfig);
