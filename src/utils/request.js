import axios from 'axios'

// 配置基础request
const request = axios.create({
    baseURL: 'localhost:3300',
    timeout: 5000,
})

// 配置前置拦截器
request.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 配置后置拦截器
request.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default request