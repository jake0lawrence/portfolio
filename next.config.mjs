import path from 'node:path';
import mdx from '@next/mdx';

const withMDX = mdx({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['next-mdx-remote'],

  sassOptions: {
    compiler: 'modern',
    silenceDeprecations: ['legacy-js-api'],
  },

  webpack(config) {
    // ---------- 1.  Alias every `react` import to our shim ----------
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias.react = path.resolve(
      __dirname,
      'src/mdx-react-shim.ts'
    );

    // ---------- 2.  Disable minification (keeps the build stable) ---
    config.optimization ??= {};
    config.optimization.minimize = false;

    return config;
  },
};

export default withMDX(nextConfig);

