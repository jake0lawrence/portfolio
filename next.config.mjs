import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@next/mdx';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);   // ← works in .mjs

const withMDX = mdx({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
export default withMDX({
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['next-mdx-remote'],

  sassOptions: {
    compiler: 'modern',
    silenceDeprecations: ['legacy-js-api'],
  },

  webpack(config) {
    /* ── 1. Always hand out our shim when “react” is imported ───────── */
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias.react = path.resolve(
      __dirname,
      'src/mdx-react-shim.ts'
    );

    /* ── 2. Disable SWC/Terser while Next bug is open ───────────────── */
    config.optimization ??= {};
    config.optimization.minimize = false;

    return config;
  },
});

