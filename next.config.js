/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add polyfills for browser APIs that PDF.js needs
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Add global polyfills for DOMMatrix and other DOM APIs
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.DefinePlugin({
        'global.DOMMatrix': 'DOMMatrix',
        'global.DOMMatrixReadOnly': 'DOMMatrixReadOnly',
        'global.DOMRect': 'DOMRect',
        'global.DOMRectReadOnly': 'DOMRectReadOnly',
        'global.DOMPoint': 'DOMPoint',
        'global.DOMPointReadOnly': 'DOMPointReadOnly',
      })
    );

    return config;
  },
};

module.exports = nextConfig; 