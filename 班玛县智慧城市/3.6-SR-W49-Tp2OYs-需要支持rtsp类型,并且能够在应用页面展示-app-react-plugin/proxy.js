module.exports = {
  '/api': {
    'target': 'http://139.170.221.41:18080/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
  '/ISAPI': {
    'target': 'http://139.170.234.27:80',
  },
  '/webSocketVideoCtrlProxy': {
    'target': 'http://139.170.234.27:7681/101',
    // 'changeOrigin': true,
    // 'pathRewrite': { '^/webSocketVideoCtrlProxy' : '' },
    ws: true
  }
}