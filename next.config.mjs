import mdx from '@next/mdx';

/** MDX loader wrapper (unchanged) */
const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['next-mdx-remote'],
  sassOptions: {
    compiler: 'modern',
    silenceDeprecations: ['legacy-js-api'],
  },

  /** Patch React.default for every bundle, both server and client */
  webpack(config) {
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      // “main-app” is Next 15’s primary runtime chunk
      // Older/later versions sometimes call it “main”
      const key = entries['main-app'] ? 'main-app' : 'main';
      if (!entries[key]) entries[key] = [];

      // Prepend our shim exactly once
      if (!entries[key].includes('./src/mdx-react-shim.ts')) {
        entries[key].unshift('./src/mdx-react-shim.ts');
      }
      return entries;
    };

    return config;
  },
};

export default withMDX(nextConfig);
