module.exports = {
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.wasm/,
        type: 'asset/resource',
      },
    ],
  },
};
