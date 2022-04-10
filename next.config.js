/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  module: {
    rules: [
      { test: /\.xlsx$/, loader: "webpack-xlsx-loader" }
    ]
  },
  env: {
    googleSheet: 'https://sheet.best/api/sheets/66b04f3a-fbf6-4c3a-9299-e8c6f618fcbc',
    excelSheet: 'https://shehroza.github.io/store-images/data.xlsx'
  }
}

module.exports = nextConfig
