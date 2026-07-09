import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // site 100% estático — compatível com o Firebase Hosting gratuito (plano Spark)
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
