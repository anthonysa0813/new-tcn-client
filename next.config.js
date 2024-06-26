/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "www.contactbpo.pe",
      "https://contact.pruebaswc.com",
      "contact.pruebaswc.com",
      "res.cloudinary.com",
    ],
  },
  // swcMinify: false,
  // serveOptions: {
  //   http: true,
  //   https: false,
  // },
  staticPageGenerationTimeout: 1000,
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(nextConfig);

