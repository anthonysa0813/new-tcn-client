/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["www.contactbpo.pe", "https://contact.pruebaswc.com", "contact.pruebaswc.com"],
  },
  swcMinify: false,
  serveOptions: {
    http: true,
    https: false,
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(nextConfig);
