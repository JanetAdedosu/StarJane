const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This is the context for API requests
    createProxyMiddleware({
      target: 'https://starjane-6.onrender.com', // Replace with your backend server address
      changeOrigin: true,
      
    })
  );
};
