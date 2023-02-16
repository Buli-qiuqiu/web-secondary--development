module.exports = {
  '/api': {
    // target: 'http://localhost:8080',
    target: 'http://10.15.111.9:13063',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
};
