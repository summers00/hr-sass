import request from "@/utils/request";

// 登录接口
export function login(data) {
  return request({
    url: "/sys/login",
    method: "post",
    data,
  });
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: "/sys/profile",
    method: "post",
  });
}

// 获取用户详情
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
    // axios默认请求方式是get,不需要再写
  });
}
