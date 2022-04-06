const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const curLesson = 'lesson-04'

module.exports = {
    mode: 'development',
    entry: path.resolve(`./${curLesson}`),
    output: {
        path: path.resolve('./dist'),
        filename: 'index.js',
        pathinfo: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: `./${curLesson}/index.html`, to: "./index.html"
            }, {
                from: `./${curLesson}/assets`, to: "./assets"
            }]
        })
    ]
};