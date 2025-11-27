/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        "http://localhost:4600", // local dev
        "book.neotericproperties.in",
        "*.my-proxy.com",
      ],
    },
  },
  images: {
    qualities: [75, 85, 95, 100], // Allowed quality values
    domains: ["book.neotericproperties.in", "neotericproperties.in"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'neotericproperties.in',
      },
    ],
  },
};

// Use ESM export
export default nextConfig;
