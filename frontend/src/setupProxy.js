const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This is the context for API requests
    createProxyMiddleware({
      target: 'http://localhost:5002', // Replace with your backend server address
      changeOrigin: true,
      headers: {
        'X-Forwarded-For': 'localhost',
      },
      onProxyReq: (proxyReq, req, res) => {
        // Optionally, you can log or modify the request headers here
        console.log(`Proxying request for: ${req.url}`);
      },
    })
  );
};
