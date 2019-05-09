const prodConfig = require('./webpack.production');
const devConfig = require('./webpack.development');

module.exports = (env) => {
  if (env.PLATFORM === "production") {
    return prodConfig(env);
  }

  return devConfig(env);
};









