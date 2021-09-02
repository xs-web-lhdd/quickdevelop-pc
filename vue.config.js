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
            '/forumApi': {
                target: 'http://159.75.112.81:8080/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/forumApi': ''
                }
            },
            '/xiaopopan': {
                target: "http://www.codeman.ink:8001/",
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/xiaopopan': ''
                }
            },
            '/gitee': {
                target: "https://gitee.com",
                changeOrigin: true,
                pathRewrite: {
                    '^/gitee': ''
                }
            }
        }
    },
}