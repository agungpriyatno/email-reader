/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                'http://localhost'
            ]
        }
    }
};

export default nextConfig;
