/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  module: {
    rules: [
      { test: /\.xlsx$/, loader: "webpack-xlsx-loader" }
    ]
  }
}

module.exports = nextConfig
