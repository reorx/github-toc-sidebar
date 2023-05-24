const webpack = require('webpack')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const ExtReloader = require('@reorx/webpack-ext-reloader')
const { merge } = require('webpack-merge')

const rootDir = path.resolve(__dirname)
const srcDir = path.join(rootDir, 'src')
const destDir = path.join(rootDir, 'build')

console.log('srcDir', srcDir)

const common = {
  entry: {
    // background keeps the extension auto reloading, please don't remove it
    background: path.join(srcDir, 'background.ts'),
    popup: path.join(srcDir, 'popup.ts'),
    options: path.join(srcDir, 'options.ts'),
    content_script: path.join(srcDir, 'content_script.ts'),
    content_style: path.join(srcDir, 'content_style.scss'),
    inject: path.join(srcDir, 'inject.ts'),
    custom_page: path.join(srcDir, 'custom_page.ts'),
  },
  output: {
    path: destDir,
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        // options: {
        //   projectReferences: true,
        // }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        oneOf: [
          // For "css" in "content_scripts", generate separate files
          // https://stackoverflow.com/a/67307684/596206
          {
            test: /content_.+\.scss$/i,
            use: [
              'sass-loader',
            ],
            type: 'asset/resource',
            generator: {
              filename: 'css/[name].css'
            }
          },
          {
            test: /\.scss$/i,
            use: [
              'style-loader',
              'css-loader',
              'sass-loader',
            ],
          },
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.join(rootDir, 'public'), to: destDir }],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
}


function developmentConfig() {
  console.log('development config')
  const config = merge(common, {
    // `eval` could not be used, see https://stackoverflow.com/questions/48047150/chrome-extension-compiled-by-webpack-throws-unsafe-eval-error
    devtool: 'cheap-module-source-map',
    mode: 'development',
    plugins: [
      new ExtReloader({
        entries: {
          background: 'background',
          contentScript: ['content_script', 'content_style'],
          extensionPage: ['custom_page'],
        },
      }),
    ],
  })

  if (process.env.MEASURE_SPEED) {
    const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
    const smp = new SpeedMeasurePlugin()
    config = smp.wrap(config)
  }
  return config
}


function productionConfig() {
  console.log('production config')
  const config = merge(common, {
    mode: 'production',
  })
  return config
}


module.exports = process.env.NODE_ENV === 'production' ? productionConfig() : developmentConfig()
