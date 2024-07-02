const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This is the context for API requests
    createProxyMiddleware({
      target: 'http://localhost:4000', // Replace with your backend server address
      changeOrigin: true,
      
    })
  );
};
