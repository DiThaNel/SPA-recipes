import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles"), path.join(__dirname, "node_modules")],
    quietDeps: true,
    silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import'],
  },
};

export default nextConfig;
