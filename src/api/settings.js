// 公司设置的接口
import request from "@/utils/request";

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: "/sys/role",
    params, //query路径传参
  });
}

//根据id获取公司信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`,
  });
}

// 根据id删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: "delete",
  });
}

// 根据角色id获取角色信息(修改)
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
  });
}

// 设置角色信息(点确定)
export function updateRole(data) {
  //返回数据有id,无需写2个，直接解构出id
  return request({
    url: `/sys/role/${data.id}`,
    method: "put",
    data, //传入要设置的内容
  });
}

// 新增角色
export function addRole(data) {
  return request({
    url: "/sys/role",
    method: "post",
    data,
  });
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: "/sys/role/assignPrem",
    method: "put",
    data,
  });
}
