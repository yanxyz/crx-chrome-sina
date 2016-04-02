const path = require('path')

module.exports = {
  context: path.join(__dirname, 'app/src'),
  entry: {
    background: './background.js',
    options: './options.js',
    popup: './popup.js'
  },
  output: {
    path: path.join(__dirname, 'app/js'),
    filename: '[name].js'
  }
}
