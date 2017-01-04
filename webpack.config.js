var webpack = require('webpack')
var path = require('path');
var entry = ['./src/js/index'];

if (process.env.NODE_ENV === undefined) {
  entry.unshift('webpack/hot/only-dev-server');
  entry.unshift('webpack-dev-server/client?http://localhost:8080');
}

module.exports = { 
  devtool: 'cheap-module-eval-source-map',
  entry: entry,
  output: {
    path: path.join(__dirname, 'build'),
    libraryTarget:'umd',
    filename: 'bundle.js'
  },  
  externals: {
    jquery:'jQuery',
    drawingboard:'drawingboard.js'
  },
  resolve: {
    alias: {
      drawingboard:'drawingboard.js/dist/drawingboard',
      drawingboardCss:'drawingboard.js/dist/drawingboard.css'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'root.jQuery': 'jquery'
    }),
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
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
        exclude: /node_modules/,
        include: __dirname
        
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: __dirname
        
      },
      {
        test: /\.(png|jpg)$/,
        loaders: ['url-loader'],
        include: __dirname
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loaders: ['url-loader'],
        include: __dirname
      }
    ] 
  }   
}    

