import { config } from '@vue/test-utils'
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from './auth'
import router from '@/router'

// 定义超时时间-秒
const timeout = 3600

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, //环境文件的变量，开发坏境/api，生产环境/prod-api
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // config请求的配置信息
  if (store.getters.token) {
    // 必须有token情况才有必要检查时间戳,看token是否已失效
    if (isTimeout()) { //如果超时
      // 登出:删除token和用户信息
      store.dispatch('user/logout')
      // 跳转到登录页
      router.push('/login')
      // 返回错误信息
      return Promise.reject(new Error('token失效'))
    }

    // 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 必须返回config
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器,成功的回调、失败的回调
service.interceptors.response.use(response => {
  // 数据解构,axios默认加了一层data
  const { success, data, message } = response.data
  if (success) { //如果响应成功，返回数据
    return data
  } else { //响应失败
    // 提示错误信息
    Message.error(message)
    // 业务错误手动抛错，进入catch
    return Promise.reject(new Error(message))
  }
}, error => {
  // 如服务器返回10002说明token失效
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 删除token和用户信息
    store.dispatch('user/logout')
    // 必须先删除token,再跳到登录页,否则有token跳不了登录,会自动跳到主页
    router.push('/login')
  } else {
    // 提示错误信息
    Message.error(error.message)
  }
  // axios是promise对象，跳出promise的执行链，使用接口时直接进入catch,传入错误对象
  return Promise.reject(error)
})

// 检查时间戳是否超时的方法
function isTimeout() {
  // 读取缓存时间
  const startTimeStamp = getTimeStamp()
  // 当前时间
  const currentTimeStamp = Date.now()
  // 当前时间-缓存时间,是否大于定义的超时时间,如大于说明超时了 时间戳单位为毫秒 转成秒
  return (currentTimeStamp - startTimeStamp) / 1000 > timeout
}
// 导出axios实例
export default service