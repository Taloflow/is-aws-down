const isProd = process.env.NODE_ENV === "production";

module.exports = {
  // Use the CDN in production and localhost for development.
  assetPrefix: isProd ? "https://front-end-for-is-aws-down.pages.dev" : "",
};
