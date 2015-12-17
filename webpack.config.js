const production = process.env.NODE_ENV === 'production';

var config = {
    debug: !production,
    devtool: production ? '' : 'source-map', 
    entry: {
        javascript: './src/index.js',
        html: './src/index.html'
    },
    output: {
        path: __dirname + "/dist",
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
            	test: /\.json$/,
            	exclude: /node_modules/,
            	loader: 'json-loader'
            }
        ]
    }
};

if (process.env.NODE_ENV === 'production') {
    var webpack = require('webpack');
    config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            test: /\.js$/
        })
    ]);
}

module.exports = config;