/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverActions: true,
  // },
  images: {
    domains: ["res.cloudinary.com", "img.clerk.com"],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
