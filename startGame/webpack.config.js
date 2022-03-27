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
    module: { // 静态资源引入图片 加上webpack url-loader解释器
        rules: [{
            test: /.(jpg|png)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 1,
              }
            }
        }, {
          test: /.list$/,
          use: ['xml-loader']
        }],
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