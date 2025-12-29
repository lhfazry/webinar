/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // Allow external images (e.g. from Supabase or social media)
            },
        ],
    },
};

export default nextConfig;
