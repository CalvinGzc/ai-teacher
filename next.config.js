/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  experimental: {
    // 禁用 SWC
    forceSwcTransforms: false
  },
  // 指定 webpack 配置
  webpack: (config, { isServer }) => {
    // 保持现有配置
    return config
  }
}

module.exports = nextConfig 