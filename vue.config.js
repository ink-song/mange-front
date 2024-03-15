const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // 设置代理
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req) => {
          // http请求
          console.log(
            '[HPM] %s %s %s %s',
            req.method,
            req.originalUrl,
            '->',
            req.url,
          );
        },
        onProxyReqWs(proxyReq, req, socket, options, head) {
          // websocket请求（单个TCP连接上进行全双工通信的协议）
          console.log('[HPM] %s %s %s %s', req.method, '-', req.url);
        },
      },
    },
  },
});
