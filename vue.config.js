module.exports = {
    publicPath: "/resources/",
    devServer: {
        proxy: {
            '/api': {
                target: 'http://api.xiao5market.com',
                ws: true,
                changeOrigin: true
            }
        }
    }
}