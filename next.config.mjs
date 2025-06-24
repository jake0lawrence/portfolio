import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@next/mdx';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const shimPath   = path.resolve(__dirname, 'src/mdx-react-shim.js');

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
    /* ---------------------------------------------- */
    /*  alias ONLY the runtime entry-points to the shim*/
    /* ---------------------------------------------- */
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'react/jsx-runtime'     : shimPath,
      'react/jsx-dev-runtime' : shimPath,
      // leave plain “react” alone!
    };

    /* Disable minification until the build is green   */
    config.optimization ??= {};
    config.optimization.minimize = false;

    return config;
  },
});
