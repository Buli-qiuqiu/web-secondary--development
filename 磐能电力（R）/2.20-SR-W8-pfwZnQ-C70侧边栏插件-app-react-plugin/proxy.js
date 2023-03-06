module.exports = {
  '/api': {
    // 'target': 'http://10.15.111.11:18087',
    'target': 'http://10.15.111.9:13098/',
    'changeOrigin': true,
    'pathRewrite': { '^/api': '' },
  },
}