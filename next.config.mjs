/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        serverActions: {
            allowedOrigins: [
                "http://localhost:4600", // local dev
                "book.neotericproperties.in",
                "fonts.gstatic.com",
            ],
        },
    },
<<<<<<< HEAD
    images: {
        qualities: [75, 85, 95, 100], // Allowed quality values
    },
    images: {
        domains: ["book.neotericproperties.in"],
    },
    reactStrictMode: true,
    swcMinify: true, // faster minification
=======
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
>>>>>>> 8dd3bac0d60ddb092da628cb6bd95d47343ea8c3
};

// Use ESM export
export default nextConfig;