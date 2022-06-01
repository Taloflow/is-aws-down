const isProd = process.env.NODE_ENV === "production";

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  // Use the CDN in production and localhost for development.
  assetPrefix: isProd ? "https://is-aws-down.pages.dev" : "",
  async redirects() {
    return [
      {
        source: '/',
        destination: '/is-aws-down',
        permanent: false
      }
    ]
  }
};
