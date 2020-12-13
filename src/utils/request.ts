import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // baseURL,
  // timeoout
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token只能使用1次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
let isRefreshing = false
// 存储刷新 token 期间过来的 401 请求
let requests: any[] = []
request.interceptors.response.use(function (response) {
  // 状态码为 2xx 都会进入这里（不同项目接口判断）
  return response
}, async function (error) {
  // 超出 2xx 状态码都执行这里
  // console.dir(error)
  if (error.response) {
    // 请求发出去收到响应，但是状态码超出了 2xx 范围（看与后端的约定）
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token 无效（没有提供token，token是无效的，token过期了）
      // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }

      // 刷新 token
      if (!isRefreshing) {
        console.log('Refresh token!!!!')
        isRefreshing = true
        // 尝试刷新获取新的 token
        return refreshToken().then(res => {
          console.log(res)
          if (!res.data.success) {
            throw new Error('刷新 Token 失败')
          }
          // 刷新 token 成功了
          store.commit('setUser', res.data.content)
          // 把 requests 对鞋中的请求重新发出出去
          requests.forEach(cb => cb())
          // 重置 requests 数组
          requests = []
          return request(error.config)
        }).catch(err => {
          console.log(err)
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false
        })
      }
      // 刷新状态下，把请求挂起放到 requests 数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) {
    // 请求发出去没有收到响应（比如网络断开了）
    Message.error('请求超时，请刷新重试')
  } else {
    // 在设置请求时发生了一些事情，出发一个错误
    Message.error(`请求失败：${error.message}`)
  }
  // 把请求失败的错误对象继续爆出，扔给下一个上一个调用者
  return Promise.reject(error)
})

export default request
