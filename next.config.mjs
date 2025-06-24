import mdx from '@next/mdx';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},       // ← add any remark/rehype plugins here
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
    // ───────────────────────────────────────────────
    // 1  Inject React-shim into every entry-point
    // ───────────────────────────────────────────────
    const origEntry = config.entry;
    config.entry = async () => {
      const entries = await origEntry();
      for (const key of Object.keys(entries)) {
        const val = entries[key];
        if (Array.isArray(val) && !val.includes('./src/mdx-react-shim.ts')) {
          val.unshift('./src/mdx-react-shim.ts');
        }
      }
      return entries;
    };

    // ───────────────────────────────────────────────
    // 2  Disable code-minification (temporary bugfix)
    // ───────────────────────────────────────────────
    config.optimization ??= {};
    config.optimization.minimize = false;

    return config;
  },
};

export default withMDX(nextConfig);

