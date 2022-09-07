const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DIST_DIR = path.join(__dirname, './dist/playground');
module.exports = {
  resolve: {
    // We use this alias and the CopyPlugin below to support using the dynamic-import version
    // of WADO Image Loader, but only when building a PWA. When we build a package, we must use the
    // bundled version of WADO Image Loader so we can produce a single file for the viewer.
    // (Note: script-tag version of the viewer will no longer be supported in OHIF v3)
    alias: {
      'cornerstone-wado-image-loader':
        'cornerstone-wado-image-loader/dist/dynamic-import/cornerstoneWADOImageLoader.min.js',
    },
  },
  plugins: [
    // Don't need as angular.json provide asset configuration
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: './node_modules/cornerstone-wado-image-loader/dist/dynamic-import',
    //       to: DIST_DIR,
    //     },
    //   ],
    //   options: {
    //     concurrency: 100,
    //   },
    // }),
  ],
};
