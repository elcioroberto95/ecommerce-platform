/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  // Prints every server-side fetch (URL + cache status) while running `next dev`.
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
