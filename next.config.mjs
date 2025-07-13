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

  // Example Sass config (your original settings kept)
  sassOptions: {
    compiler: 'modern',
    silenceDeprecations: ['legacy-js-api'],
  },

  // Remote image domains
  images: {
    remotePatterns: [
      // Unsplash (already present)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Imgur direct-image host
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
    ],
  },
};

export default withMDX(nextConfig);
