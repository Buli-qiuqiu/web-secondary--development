module.exports = {
  '/api': {
    'target': 'http://10.15.111.15:12345',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}