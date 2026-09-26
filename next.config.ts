import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: path.resolve(__dirname, "node_modules/buffer/"),
      stream: false,
      crypto: false,
      fs: false,
      net: false,
      tls: false,
      http: false,
      https: false,
      zlib: false,
      querystring: false,
      url: false,
      assert: false,
      events: false,
      path: false,
      process: false,
      string_decoder: false,
      util: false,
      punycode: false,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      buffer: path.resolve(__dirname, "node_modules/buffer/"),
      "process/browser": path.resolve(__dirname, "node_modules/process/browser.js"),
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      })
    );
    return config;
  },
};

export default nextConfig;
