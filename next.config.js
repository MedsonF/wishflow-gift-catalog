/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['*'], // Ajuste conforme necessário para seus domínios de imagem
  },
}

module.exports = nextConfig 