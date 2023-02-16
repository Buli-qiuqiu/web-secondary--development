module.exports = {
  "/api": {
    target: "http://121.36.134.217:47264/dtyq/pngf/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
