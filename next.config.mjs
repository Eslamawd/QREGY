// @ts-check
import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
};

const withPWA = withPWAInit({
  dest: "public",
  // يجب أن يكون true للإنتاج، و false للتطوير لتجنب مشاكل الكاش
  disable: process.env.NODE_ENV === "development",
  register: true, // تسجيل Service Worker تلقائياً
  skipWaiting: true, // تحديث Service Worker فوراً
});

export default withPWA(nextConfig);
