module.exports = {
  '/api': {
    'target': 'http://10.15.110.7:18180/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}
