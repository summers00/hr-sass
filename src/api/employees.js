import request from "@/utils/request";

// 获取员工简单列表
export function getEmployeeSimple() {
  return request({
    url: "/sys/user/simple",
  });
}

// 获取员工列表
export function getEmployeeList(params) {
  return request({
    url: "/sys/user",
    params, //query传参
  });
}

// 删除员工
export function delEmployee(id) {
  //传入要删除的员工id
  return request({
    //参数前加斜杠
    url: `/sys/user/${id}`,
    method: "delete",
  });
}

// 新增员工
export function addEmployee(data) {
  return request({
    url: "/sys/user",
    method: "post",
    data,
  });
}

// 导入员工
export function importEmplyee(data) {
  return request({
    url: "/sys/user/batch",
    method: "post",
    data,
  });
}

// 保存员工基本信息
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: "put",
    data,
  });
}

// 获取员工个人信息
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`,
  });
}

// 更新员工个人信息
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: "put",
    data,
  });
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`,
  });
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: "put",
    data,
  });
}

/** *
 * 给用户分配角色
 * ***/
export function assignRoles(data) {
  return request({
    url: "/sys/user/assignRoles",
    data,
    method: "put",
  });
}
