// const isProd = process.env.NODE_ENV === "production";

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  basePath: '/is-aws-down',
  assetPrefix: iprocess.env.CF_PAGES === '1' ? process.env.CF_PAGES_URL ?? "/" : "/"
};
