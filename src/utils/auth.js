import Cookies from 'js-cookie'

const TokenKey = 'ihrm-token' //唯一的tokenkey
const TimeKey = 'ihrm-timestamp' //唯一的时间戳key

// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}

// 设置时间戳
export function setTimeStamp() {
  // 设置时间戳为当前时间
  Cookies.set(TimeKey, Date.now())
}