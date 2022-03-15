import { constantRoutes, asyncRoutes } from "@/router";
const state = {
  routes: [], //路由表,当前用户所拥有权限的路由页面,默认都有静态路由
};
const mutations = {
  // 修改路由表
  setRoutes(state, newRoutes) {
    //在静态路由基础上加,不能用state的数据,因退出就不能再使用该用户的路由
    state.routes = [...constantRoutes, ...newRoutes]; //静态路由+新添加的路由
  },
};

const actions = {
  // 筛选权限路由menus['标识']和动态路由中name对应上就是当前用户拥有的路由权限
  filterRoutes(context, menus) {
    const routes = [];
    menus.forEach((key) => {
      //key为标识'employees'
      //item:{name:}
      routes.push(...asyncRoutes.filter((item) => item.name === key)); //将筛出来的用户拥有的权限路由保存到数组
    });
    // 提交修改routes的方法
    context.commit("setRoutes", routes);
    return routes; //返回动态路由权限,调用这个方法时用,state数据用于显示左侧菜单
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
