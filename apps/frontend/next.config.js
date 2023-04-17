// const isProd = process.env.NODE_ENV === "production";

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  basePath: '/is-aws-down',
  assetPrefix: process.env.CF_PAGES === '1' ? `https://${process.env.CF_PAGES_URL}` ?? "/" : "/"
};
