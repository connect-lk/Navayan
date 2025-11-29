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
    images: {
        qualities: [75, 85, 95, 100], // Allowed quality values
    },
    images: {
        domains: ["book.neotericproperties.in"],
    },
    reactStrictMode: true,
    swcMinify: true, // faster minification
};

// Use ESM export
export default nextConfig;