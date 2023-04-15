// const isProd = process.env.NODE_ENV === "production";

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  // Use the CDN in production and localhost for development.
  basePath: '/is-aws-down',
  // assetPrefix: isProd ? "https://is-aws-down.pages.dev" : ""
  assetPrefix: '/is-aws-down/'
};
