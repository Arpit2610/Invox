const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    "http": require.resolve("stream-http"),
                    "https": require.resolve("https-browserify"),
                    "util": require.resolve("util/"),
                    "zlib": require.resolve("browserify-zlib"),
                    "stream": require.resolve("stream-browserify"),
                    "url": require.resolve("url/"),
                    "assert": require.resolve("assert/"),
                    "crypto": require.resolve("crypto-browserify"),
                    "path": require.resolve("path-browserify"),
                    "process": false,
                    "fs": false,
                    "net": false,
                    "tls": false
                }
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: require.resolve('process/browser'),
                Buffer: ['buffer', 'Buffer']
            })
        ]
    }
}; 