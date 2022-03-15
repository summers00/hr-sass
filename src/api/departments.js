import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除部门,传入部门id
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete' //支持restful规则，相同地址，不同方法，执行不同的业务
    // 删除delete 添加post 修改put 获取get
  })
}

// 增加部门
export function addDepartments(data) {
  return request({
    url: '/company/department', //restful规则，相同地址不同业务
    method: 'post',
    data  //放axios中请求体内
  })
}

// 获取部门详细信息
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 修改部门信息
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}