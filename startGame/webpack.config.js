const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: path.resolve('./src/'),
    output: {
        path: path.resolve('./dist'),
        filename: 'index.js',
        pathinfo: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: "./src/index.html", to: "./index.html"
            }, {
                from: "./src/assets", to: "./assets"
            }]
        })
    ]
};