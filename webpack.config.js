const fs = require('fs');

if (fs.existsSync('./env.json')) {
  const webpack = require('webpack');
  const path = require('path');
  const TerserPlugin = require("terser-webpack-plugin");
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  const ImageminPlugin = require('imagemin-webpack-plugin').default;
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const bourbon = require('node-bourbon').includePaths;
  const envConfig = require('./env.json');

  module.exports = (env, argv) => {
    var plugins = [],
        build = process.env.APP_ENV || argv.mode,
        production = build === 'production' || argv.mode === 'production',
        path_theme = envConfig[build].path || 'www',
        path_assets = path_theme + '/assets'
        filename = (production) ? '[name]' : '[name]',
        replacePatterns = {};

    for (var i in envConfig) {
      if (i === build) {
        var environment = envConfig[i];

        replacePatterns[i] = [];

        envConfig.global.replacements.config = envConfig.global.replacements.config || {};
        envConfig.global.replacements.config.version = process.env.npm_package_version;
        envConfig.global.replacements.config.env = build;

        if (envConfig.global) {
          if (envConfig.global.replacements) {
            for (var j in envConfig.global.replacements) {
              var main = envConfig.global.replacements[j];

              for (var k in main) {
                replacePatterns[i].push({
                  search: '@@' + j + '.' + k,
                  replace: main[k],
                  flags: 'g',
                });
              }
            }
          }
        }

        if (environment.replacements) {
          var replacements = environment.replacements;

          replacePatterns[i].push({
            search: '@@environment',
            replace: i,
            flags: 'g',
          });

          for (var j in replacements) {
            var main = replacements[j];

            for (var k in main) {
              replacePatterns[i].push({
                search: '@@' + j + '.' + k,
                replace: main[k],
                flags: 'g',
              });
            }
          }
        }

        if (environment.filenames) {
          for (var j in environment.filenames) {
            filenames[j] = environment.filenames[j];
          }
        }
      }
    }

    plugins.push(new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      filename: './../../index.html',
      inject: false,
      minify: production
    }));

    plugins.push(new webpack.DefinePlugin({
      ENV: {
        debug: (production === false),
        version: JSON.stringify(process.env.npm_package_version)
      }
    }));

    plugins.push(new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/images'),
          to: path.resolve(__dirname, path_assets + '/images'),
          globOptions: {
            ignore: ['.DS_Store']
          }
        },
        {
          from: path.resolve(__dirname, 'static'),
          to: path.resolve(__dirname, path_theme),
          globOptions: {
            ignore: ['.DS_Store']
          }
        }
      ]
    }));

    plugins.push(new MiniCssExtractPlugin({
      filename: '../css/style.css'
    }));

    plugins.push(new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }));

    plugins.push(new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.resolve(__dirname, path_theme + '/**/*')
      ]
    }));

    return {
      optimization: {
        minimize: production,
        minimizer: [
          new TerserPlugin(),
        ],
        splitChunks: {
          chunks: 'async'
        }
      },
      entry: {
        './../css/style': './src/scss/app.scss',
        'script': './src/js/app.js',
      },
      output: {
        filename: filename + '.js',
        path: path.resolve(__dirname, path_assets + '/js'),
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
            }
          },
          {
            test: /.*\.html$/,
            loader: 'raw-loader',
          },
          {
            test: /.*\.html$/,
            loader: 'string-replace-loader',
            options: {
              multiple: replacePatterns[build]
            }
          },
          {
            test: /app\.scss$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: 'images/'
                }
              },
              {
                loader: "css-loader",
                options: {
                  url: false,
                }
              },
              {
                loader: "sass-loader",
                options: {
                  sassOptions: {
                    outputPath: 'images/'
                  }
                },
              },
            ],
          },
          {
            test: /\.(woff|woff2|eot|ttf|svg|otf)$/,
            exclude: [/images/],
            use: [{
              loader: 'file-loader',
              options: {
                outputPath: './../css/fonts/',
              }
            }],
          },
        ]
      },
      plugins: plugins
    };
  }
} else {
  console.log('Missing env.json file'); process.exit(0);
}