module.exports = {
  '/api': {
    // 'target': 'http://10.15.111.9:12892/',
    'target': 'http://14.21.43.41:18080/',
    'changeOrigin': true,
    'pathRewrite': { '^/api': '' },
  },
}
