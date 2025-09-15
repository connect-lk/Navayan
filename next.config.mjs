/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 85, 95], // Allowed quality values
  },
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
};

// Use ESM export
export default nextConfig;
