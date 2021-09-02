import axios from 'axios'

export function request(url, params, type) {
    // 请求超过30秒则判定为超时
    const instance = axios.create({
        baseURL: '/forumApi',
        timeout: 30000,
        withCredentials: true,
    });

    // axios拦截器
    // 请求拦截
    instance.interceptors.request.use(config => {
        // console.log('请求拦截器');
        // if (window.localStorage.getItem('tokenName')) {
        // config.headers.MaoyanToken = window.localStorage.getItem('tokenValue')
        // config.headers.tokenName = window.localStorage.getItem('tokenName')
        // }

        return config
    }, err => {
        console.log(err);
    });

    instance.defaults.withCredentials = true;


    if (!type || type == 'get') {
        if (params) {
            params = {
                params: params
            }
            return instance.get(url, params)
        } else {
            return instance.get(url)
        }
    } else if (type == 'post') {
        return instance.post(url, params)
    }

}