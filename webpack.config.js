/* eslint-env node */

const path = require("path")
const webpack = require("webpack")

const HtmlWebpackPlugin = require("html-webpack-plugin")
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")  // For service worker
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const packageJson = require("./package.json")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {pages} = require("./pages");
const version = packageJson.version

// Initialize dotenv support, the earlier the better
require("dotenv").config()

const minifyOptions = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}

function createHtmlPlugins(pages, mode) {
  return pages.map((template, i) => {
    const {title, srcPath, ...rest} = template
    const numTemplates = pages.length
    const isRootIndex = srcPath === "index.html"
    const prev = pages[i === 0 ? numTemplates - 1 : (i - 1)]
    const next = pages[i === numTemplates - 1 ? 0 : (i + 1)]
    const normalize = (url) => url && url.replace(/\/index\.html$/, "")
    return new HtmlWebpackPlugin({
      ...rest,
      title: `${title}${mode !== "production" ? ` [${mode}]` : ""}`,
      prev: normalize(`${!isRootIndex ? "../" : ""}${prev.srcPath}`),
      next: normalize(`${!isRootIndex ? "../" : ""}${next.srcPath}`),
      template: `src/${srcPath}`,
      filename: srcPath,
      minify: minifyOptions,
      js: ["[chunkhash].js"],
      chunks: template.chunks ?? ["index"]
    })
  })
}

function config(mode, env) {
  console.log("Building for", mode)
  const analyzeBundle = false
  console.log("Env is", env)
  const isDevelopment = mode === "development"
  const plugins = [
    new FaviconsWebpackPlugin({
      logo: `./src/favicon${isDevelopment ? "-dev" : ""}-32x32.png`,
      mode: "light",
      publicPath: "/",
    }),
    ...createHtmlPlugins(pages, mode),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'static'),
          to: "",
          globOptions: {
            ignore: ['.DS_Store']
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: "css/[chunkhash].css"
    })
    /*    new WorkboxPlugin.GenerateSW({
          // these options encourage the ServiceWorkers to get in there fast
          // and not allow any straggling "old" SWs to hang around
          clientsClaim: true,
          skipWaiting: true,
        }),*/
  ]
  if (analyzeBundle) {
    plugins.push(new BundleAnalyzerPlugin({mode: analyzeBundle ? "static" : "disabled", openAnalyzer: false}))
  }
  return {
    mode,
    entry: {
      index: {
        import: "./src/index.ts"
        // dependOn: "service_worker"
      }
      //   service_worker: "./src/service-worker.js"
    },
    devtool: isDevelopment ? 'source-map' : false,
    devServer: {
      https: false,                      // Required by service workers if we don't use localhost
      host: "0.0.0.0",
      allowedHosts: [".lvh.me"],
      historyApiFallback: true
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.worker\.js$/,
          use: {loader: "worker-loader"}
        },
        {
          test: [/\.js$/],
          enforce: "pre",
          exclude: /node_modules/,
          use: ["source-map-loader"]
        },
        {
          test: /(?<!\.wc)\.scss$/,
          use: [
            isDevelopment && process.env.HOT_RELOAD_CSS === "true" ? "style-loader" : {loader: MiniCssExtractPlugin.loader},
            "css-loader",     // Translates CSS into CommonJS
            "sass-loader"     // Compiles Sass to CSS
          ],
          exclude: /node_modules/
        },
        {
          test: /\.wc\.scss$/,
          type: "asset/source",
          use: [
            "sass-loader"     // Compiles Sass to CSS
          ],
          exclude: /node_modules/
        },
        {
          test: /\.svg$/i,
          type: "asset/resource"
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      modules: [
        path.resolve("./node_modules"),
        path.resolve("./src")
      ]
    },
    output: {
      filename: `[chunkhash]${env !== "production" ? "-[name]" : ""}.js`,
      path: path.resolve(__dirname, "dist")
    }
  }
}

module.exports = (env, argv) => {
  const mode = argv.mode || process.env.NODE_ENV
  return config(mode, env)
}
