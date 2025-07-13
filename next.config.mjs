import mdx from '@next/mdx';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},          // no remark/rehype plugins
});

/** @type {import('next').NextConfig} */
const nextConfig = {
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
