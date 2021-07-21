module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
                'plugins': '@/plugins',
            }
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://159.75.112.81:8080/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/articleImg': {
                target: 'https://img2.woyaogexing.com/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/articleImg': ''
                }
            }
        }
    },
}