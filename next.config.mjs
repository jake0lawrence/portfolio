import mdx from '@next/mdx';

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
  webpack(config) {
    const origEntry = config.entry;
    config.entry = async () => {
      const entries = await origEntry();
      const key = entries['main-app'] ? 'main-app' : 'main';
      if (!entries[key]) entries[key] = [];
      if (!entries[key].includes('./src/mdx-react-shim.ts')) {
        entries[key].unshift('./src/mdx-react-shim.ts');
      }
      return entries;
    };
    return config;
  },
};

export default withMDX(nextConfig);
