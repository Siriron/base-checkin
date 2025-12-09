/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/.well-known/farcaster.json', // This is the URL Base Build will use
        destination: '/farcaster.json'          // This is the actual file in public/
      }
    ]
  }
};

module.exports = nextConfig;
