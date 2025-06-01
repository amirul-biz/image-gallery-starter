module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dehranayi/image/upload/**", // ✅ match your Cloudinary path
      },
    ],
    
  },
};
