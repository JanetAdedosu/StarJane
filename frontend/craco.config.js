const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });

      return webpackConfig;
    },
  },
};
