module.exports = {
    publicPath: "/resources/",
    devServer: {
        proxy: {
            '/api': {
                target: 'http://api.xiao5market.com',
                ws: true,
                changeOrigin: true
            },
            '/task': {
                target: 'http://10.192.16.9',
                ws: true,
                changeOrigin: true
            }
        }
    },
    chainWebpack: config => {
        config.module
            .rule('js')
            .exclude
            .add(/assets\/kityformula/);

        config.module
            .rule('eslint')
            .exclude
            .add(/assets\/kityformula/);
    }
}
