const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Prefix all API requests with /api
    createProxyMiddleware({
      target: 'http://localhost:3000', // Your backend URL
      changeOrigin: true,
    })
  );
};