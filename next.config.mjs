import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@next/mdx';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const withMDX = mdx({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
export default withMDX({
  pageExtensions   : ['ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['next-mdx-remote'],
  sassOptions      : {
    compiler            : 'modern',
    silenceDeprecations : ['legacy-js-api'],
  },
  webpack(config) {
    config.resolve ??= {};

    /* Disable minification until the build is green   */
    config.optimization ??= {};
    config.optimization.minimize = false;

    return config;
  },
});
