/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["mediaid.id", "localhost:3000", "mailer:3000"]
        }
    }
};

export default nextConfig;
