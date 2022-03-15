// 子模块的快捷访问
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  name: (state) => state.user.userInfo.username, //如果userInfo设为null访问name会报错，空对象找不到会undefined
  userId: (state) => state.user.userInfo.userId, //用户id
  staffPhoto: (state) => state.user.userInfo.staffPhoto, //用户头像
  companyId: (state) => state.user.userInfo.companyId, //公司id
  routes: (state) => state.permission.routes, //权限路由表
};
export default getters;
