/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite mostrar las imágenes que se suban a Supabase Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
