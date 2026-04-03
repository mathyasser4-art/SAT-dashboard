const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://sat-backend-production.up.railway.app',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        })
    );
};
