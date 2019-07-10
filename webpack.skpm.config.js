const path = require('path');
module.exports = function (config, isPluginCommand) {
    config.resolve.alias = {
      'fs': path.resolve(__dirname, './node_modules/@skpm/fs/index.js'),
    };
}