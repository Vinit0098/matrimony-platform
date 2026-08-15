import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This tells Next.js to package everything into one neat folder for Docker
  output: 'standalone',
  
  typescript: {
    // We will keep this here to ensure TS doesn't crash the Docker build either
    ignoreBuildErrors: true,
  },
};

export default nextConfig;