// @ts-check
import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
};

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: false,
});

export default withPWA(nextConfig);
