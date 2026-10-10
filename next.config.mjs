/** @type {import('next').NextConfig} */
const nextConfig = {
  // A package-lock.json in a parent folder makes Next guess the wrong workspace root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
