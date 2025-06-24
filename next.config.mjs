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

  /** Disable minification until WebpackError bug is fixed */
  webpack(config) {
    // ---- inject our React-default shim ----
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

    // ---- turn off minification (fixes _webpack.WebpackError crash) ----
    config.optimization ??= {};
    config.optimization.minimize = false;

    return config;
  },
};

export default withMDX(nextConfig);
