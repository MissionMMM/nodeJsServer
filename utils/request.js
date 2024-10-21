const axios = require('axios')
// 外部其他URL請求封裝

axios.defaults.timeout = 5000

// 添加请求拦截器
// 在请求发送之前 做拦截 插入一些自定义配置 [参数的处理]
axios.interceptors.request.use((config) => {
    config.headers = {
        "Content-Type": "application/json",
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 响应拦截器
// 在响应返回的客户端之前 做拦截 重点处理返回的数据
axios.interceptors.response.use((response) => {
    // 2xx 范围内的状态都会触发该函数
    // 对响应数据做点什么
    return response.data
}, (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    return Promise.reject(error)
})

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
        }).then((response) => {
            resolve(response);
        })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(
            (response) => {
                //关闭进度条
                // resolve(response.data);
                resolve(response);
            },
            (err) => {
                reject(err);
            }
        );
    });
}

module.exports = {
    get,
    post
}