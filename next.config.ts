import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/balcony-garden" : "";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath,
  assetPrefix: isGithubPages ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
