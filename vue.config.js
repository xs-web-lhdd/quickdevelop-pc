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
            '/articleImg': {
                target: 'https://img2.woyaogexing.com/',
                changeOrigin: true,
                ws: true,
                secure: false,
                pathRewrite: {
                    '^/articleImg': ''
                }
            },
            '/imgreq': {
                target: 'https://chen110.oss-cn-guangzhou.aliyuncs.com/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/imgreq': ''
                }
            },
            '/xiaopopan': {
                target: "http://www.codeman.ink:8001/",
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/xiaopopan': ''
                }
            }
        }
    },
}