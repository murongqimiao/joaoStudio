const path = require('path')
module.exports = {
    mode: 'development',
    entry: path.resolve('./src/'),
    output: {
        path: path.resolve('./dist'),
        filename: 'file.js',
        pathinfo: true
    }
};