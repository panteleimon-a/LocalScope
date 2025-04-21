const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use((req, res, next) => {
    console.log('Proxying request:', req.url);
    next();
  });
  app.use(
    [
      '/user',
      '/products',
      '/api',
      '/orders',
      '/auth',
      '/admin',
      '/vending',
      '/status'
    ],
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};