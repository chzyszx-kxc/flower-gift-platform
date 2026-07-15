const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: '/flower/',
  transpileDependencies: true,

  // 配置跨域代理
  devServer: {
    proxy: {
      '/flower/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        pathRewrite: {
          '^/flower/api': ''
        }
      }
    }
  },
})
