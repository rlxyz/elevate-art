import withBundleAnalyzer from "@next/bundle-analyzer";

/**
 *
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
const defineNextConfig = (config) => {
  if (process.env.ANALYZE) {
    return withBundleAnalyzer(config);
  }
  return config;
};

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "localhost"],
  },
  experimental: {
    appDir: true,
    transpilePackages: ["@elevateart/ui"],
  },
});
