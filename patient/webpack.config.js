var path = require('path')
var webpack = require('webpack')

var env = process.env.NODE_ENV
var config = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './clinical_table'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'clinical_table.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.css$/,
        loaders: ['style', 'raw'],
        include: __dirname
      }
    ]
  }
}

if (env === 'production') {
  config.devtool = 'source-map';
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    })
  )
} else {
  config.entry.push('webpack-hot-middleware/client')
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
