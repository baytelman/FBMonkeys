
module.exports = {
  context: __dirname + '/',
  entry: {
    app: './entry.js',
  },

  output: {
    filename: '[name].js',
    path: __dirname + '/public/js',
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {presets: ['react', 'es2015']},
      }
    ],
  },
}
