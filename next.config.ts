import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "frwtypuoghhirvuwqyvj.supabase.co",
        pathname: "/storage/v1/object/public/doctor-images/**",
      },
    ],
  },
};

export default nextConfig;
