/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
  // Exclude backend Lambda functions from Next.js compilation
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@aws-sdk/client-cloudwatch': 'commonjs @aws-sdk/client-cloudwatch',
      });
    }
    return config;
  },
  // Exclude backend directory from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    dirs: ['src', 'app'], // Only lint src and app directories, not backend
  },
}

export default nextConfig