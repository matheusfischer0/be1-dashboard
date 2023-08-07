/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "be1-app-bucket.s3.sa-east-1.amazonaws.com",
      "d307btv7xwt4il.cloudfront.net",
      "ui-avatars.com",
      "localhost"
    ],
  },

}

module.exports = nextConfig
