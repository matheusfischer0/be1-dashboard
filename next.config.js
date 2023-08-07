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
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }

}

module.exports = nextConfig
