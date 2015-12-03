var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    browsers: [ 'Firefox' ],
    singleRun: true,
    frameworks: [ 'mocha' ],
    files: [
      'tests.webpack.js'
    ],
    plugins: [ 'karma-firefox-launcher', 'karma-chai', 'karma-mocha',
      'karma-sourcemap-loader', 'karma-webpack', 'karma-coverage',
      'karma-mocha-reporter'
    ],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'mocha', 'coverage' ], 
    webpack: { 
      devtool: 'inline-source-map', 
      module: {
      loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
              test: /\.json$/,
              exclude: /node_modules/,
              loader: 'json-loader'
            }
        ],
        postLoaders: [ { 
            test: /\.js$/,
            exclude: /test|node_modules/,
            loader: 'istanbul-instrumenter' } ]
      }
    },
    webpackServer: {
      noInfo: true 
    },
    coverageReporter: {
      type: 'lcov', 
      dir: 'coverage/' 
    }
  });
};