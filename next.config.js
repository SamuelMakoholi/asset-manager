/** @type {import('next').NextConfig} */
const nextConfig = {

  serverExternalPackages: ['bcrypt', '@mapbox/node-pre-gyp'],
  
  // Explicitly enable Turbopack with empty config
  turbopack: {},
  

  // Add webpack configuration as fallback for webpack mode
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to bundle bcrypt on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bcrypt: false,
        '@mapbox/node-pre-gyp': false
      };
    }
    return config;
  }
};

module.exports = nextConfig;
